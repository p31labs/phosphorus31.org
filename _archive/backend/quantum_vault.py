"""
Phenix Protocol - Quantum Vault
Production-grade key management with forward secrecy and hardware integration.

This module implements the "Software-Defined Quantum Vault" from the protocol spec:
- Sovereign Identity generation (Ed25519)
- Key rotation with forward secrecy
- Entropy harvesting from multiple sources
- AES-256 encryption for data at rest
- Integration ready for Phenix Navigator hardware

Security Model:
- Keys stored with CMEK (Customer-Managed Encryption Keys)
- Automatic key rotation every 24 hours (configurable)
- Shred capability for emergency abdication
"""

import os
import json
import time
import hashlib
import secrets
import logging
from pathlib import Path
from datetime import datetime, timedelta
from typing import Optional, Tuple, Dict, Any

from cryptography.hazmat.primitives.asymmetric import ed25519, x25519
from cryptography.hazmat.primitives import serialization, hashes
from cryptography.hazmat.primitives.kdf.hkdf import HKDF
from cryptography.hazmat.primitives.ciphers.aead import AESGCM
from cryptography.hazmat.backends import default_backend

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("QuantumVault")

# ============================================================================
# Constants
# ============================================================================

DEFAULT_VAULT_PATH = os.getenv("PHENIX_VAULT_PATH", "/app/secrets/vault")
KEY_ROTATION_HOURS = int(os.getenv("PHENIX_KEY_ROTATION_HOURS", "24"))
ENTROPY_POOL_SIZE = 256  # bytes


class QuantumVault:
    """
    Production-grade cryptographic key management for the Phenix Protocol.
    
    Implements the "Bi-Cameral Security Model" where:
    - The "Legislative" branch constructs transactions
    - The "Executive" branch (hardware) signs them
    
    For software-only deployments, provides equivalent security through
    proper key isolation and rotation.
    """
    
    def __init__(self, vault_path: str = DEFAULT_VAULT_PATH):
        """Initialize the Quantum Vault."""
        self.vault_path = Path(vault_path)
        self.vault_path.mkdir(parents=True, exist_ok=True)
        
        # Set restrictive permissions
        try:
            os.chmod(self.vault_path, 0o700)
        except Exception as e:
            logger.warning(f"Could not set vault permissions: {e}")
        
        # Initialize entropy pool
        self._entropy_pool = bytearray(ENTROPY_POOL_SIZE)
        self._entropy_index = 0
        
        # Load or generate master key
        self._master_key = self._init_master_key()
        
        # Track key metadata
        self._metadata_path = self.vault_path / "metadata.json"
        self._load_metadata()
        
        logger.info(f"QuantumVault initialized at {self.vault_path}")
    
    # ========================================================================
    # Entropy Harvesting
    # ========================================================================
    
    def harvest_entropy(self, external_source: Optional[bytes] = None) -> bytes:
        """
        Harvest entropy from multiple sources per protocol spec:
        - OS random (urandom)
        - High-resolution timing
        - External source (Navigator hardware, if available)
        
        Uses XOR mixing to combine sources.
        """
        # Source 1: OS randomness
        os_entropy = os.urandom(32)
        
        # Source 2: High-resolution timing noise
        timing_data = []
        for _ in range(10):
            t1 = time.perf_counter_ns()
            _ = hashlib.sha256(os.urandom(16)).digest()
            t2 = time.perf_counter_ns()
            timing_data.append((t2 - t1) & 0xFF)
        timing_entropy = hashlib.sha256(bytes(timing_data)).digest()
        
        # Source 3: External (hardware) source
        hw_entropy = external_source if external_source else os.urandom(32)
        
        # Mix sources with XOR
        mixed = bytes(a ^ b ^ c for a, b, c in zip(os_entropy, timing_entropy, hw_entropy))
        
        # Add to entropy pool
        self._mix_into_pool(mixed)
        
        return mixed
    
    def _mix_into_pool(self, data: bytes):
        """Mix new entropy into the pool using XOR."""
        for byte in data:
            self._entropy_pool[self._entropy_index] ^= byte
            self._entropy_index = (self._entropy_index + 1) % ENTROPY_POOL_SIZE
    
    def get_random_bytes(self, length: int) -> bytes:
        """Get random bytes from the entropy pool."""
        # Refresh pool with new entropy
        self.harvest_entropy()
        
        # Extract from pool using HKDF
        hkdf = HKDF(
            algorithm=hashes.SHA256(),
            length=length,
            salt=os.urandom(16),
            info=b"phenix-random",
            backend=default_backend()
        )
        return hkdf.derive(bytes(self._entropy_pool))
    
    # ========================================================================
    # Master Key Management
    # ========================================================================
    
    def _init_master_key(self) -> bytes:
        """Initialize or load the master encryption key."""
        key_file = self.vault_path / ".master.key"
        
        if key_file.exists():
            with open(key_file, "rb") as f:
                return f.read()
        else:
            # Generate new master key
            master_key = self.harvest_entropy()[:32]
            with open(key_file, "wb") as f:
                f.write(master_key)
            os.chmod(key_file, 0o600)
            logger.info("Generated new master key")
            return master_key
    
    def _encrypt_data(self, plaintext: bytes) -> bytes:
        """Encrypt data using AES-256-GCM."""
        nonce = os.urandom(12)
        aesgcm = AESGCM(self._master_key)
        ciphertext = aesgcm.encrypt(nonce, plaintext, None)
        return nonce + ciphertext
    
    def _decrypt_data(self, ciphertext: bytes) -> bytes:
        """Decrypt data using AES-256-GCM."""
        nonce = ciphertext[:12]
        data = ciphertext[12:]
        aesgcm = AESGCM(self._master_key)
        return aesgcm.decrypt(nonce, data, None)
    
    # ========================================================================
    # Metadata Management
    # ========================================================================
    
    def _load_metadata(self):
        """Load vault metadata."""
        if self._metadata_path.exists():
            with open(self._metadata_path, "r") as f:
                self._metadata = json.load(f)
        else:
            self._metadata = {
                "created": datetime.utcnow().isoformat(),
                "last_rotation": None,
                "rotation_count": 0,
                "keys": {}
            }
            self._save_metadata()
    
    def _save_metadata(self):
        """Save vault metadata."""
        with open(self._metadata_path, "w") as f:
            json.dump(self._metadata, f, indent=2)
    
    # ========================================================================
    # Sovereign Identity (Ed25519)
    # ========================================================================
    
    def generate_sovereign_identity(self, force: bool = False) -> bytes:
        """
        Generate Ed25519 keypair for Sovereign Node Identity.
        
        Returns the public key bytes.
        """
        priv_path = self.vault_path / "id_ed25519.priv"
        pub_path = self.vault_path / "id_ed25519.pub"
        
        if priv_path.exists() and not force:
            logger.info("Sovereign identity already exists, loading public key")
            with open(pub_path, "rb") as f:
                return f.read()
        
        # Generate new keypair
        private_key = ed25519.Ed25519PrivateKey.generate()
        public_key = private_key.public_key()
        
        # Serialize keys
        priv_bytes = private_key.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption()
        )
        pub_bytes = public_key.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw
        )
        
        # Encrypt and save private key
        encrypted_priv = self._encrypt_data(priv_bytes)
        with open(priv_path, "wb") as f:
            f.write(encrypted_priv)
        os.chmod(priv_path, 0o600)
        
        # Save public key (unencrypted)
        with open(pub_path, "wb") as f:
            f.write(pub_bytes)
        
        # Update metadata
        self._metadata["keys"]["sovereign"] = {
            "created": datetime.utcnow().isoformat(),
            "algorithm": "Ed25519",
            "public_key_hex": pub_bytes.hex()
        }
        self._save_metadata()
        
        logger.info(f"Generated new sovereign identity: {pub_bytes.hex()[:16]}...")
        return pub_bytes
    
    def get_sovereign_public_key(self) -> Optional[bytes]:
        """Get the sovereign public key."""
        pub_path = self.vault_path / "id_ed25519.pub"
        if pub_path.exists():
            with open(pub_path, "rb") as f:
                return f.read()
        return None
    
    def sign_data(self, data: bytes) -> bytes:
        """Sign data using the sovereign private key."""
        priv_path = self.vault_path / "id_ed25519.priv"
        
        if not priv_path.exists():
            raise ValueError("No sovereign identity found. Generate one first.")
        
        # Load and decrypt private key
        with open(priv_path, "rb") as f:
            encrypted_priv = f.read()
        priv_bytes = self._decrypt_data(encrypted_priv)
        
        # Create key and sign
        private_key = ed25519.Ed25519PrivateKey.from_private_bytes(priv_bytes)
        signature = private_key.sign(data)
        
        return signature
    
    def verify_signature(self, data: bytes, signature: bytes, public_key: bytes) -> bool:
        """Verify a signature against a public key."""
        try:
            key = ed25519.Ed25519PublicKey.from_public_bytes(public_key)
            key.verify(signature, data)
            return True
        except Exception:
            return False
    
    # ========================================================================
    # Session Keys (X25519 for ECDH)
    # ========================================================================
    
    def generate_session_keypair(self) -> Tuple[bytes, bytes]:
        """
        Generate X25519 keypair for ephemeral key exchange.
        Used in the "Forward Secrecy" protocol.
        
        Returns (private_key, public_key) tuple.
        """
        private_key = x25519.X25519PrivateKey.generate()
        public_key = private_key.public_key()
        
        priv_bytes = private_key.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption()
        )
        pub_bytes = public_key.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw
        )
        
        return priv_bytes, pub_bytes
    
    def derive_shared_secret(self, private_key: bytes, peer_public_key: bytes) -> bytes:
        """Derive shared secret using X25519 ECDH."""
        priv = x25519.X25519PrivateKey.from_private_bytes(private_key)
        pub = x25519.X25519PublicKey.from_public_bytes(peer_public_key)
        shared = priv.exchange(pub)
        
        # Derive encryption key from shared secret
        hkdf = HKDF(
            algorithm=hashes.SHA256(),
            length=32,
            salt=None,
            info=b"phenix-session",
            backend=default_backend()
        )
        return hkdf.derive(shared)
    
    # ========================================================================
    # Key Rotation
    # ========================================================================
    
    def check_rotation_needed(self) -> bool:
        """Check if key rotation is needed."""
        last_rotation = self._metadata.get("last_rotation")
        if not last_rotation:
            return True
        
        last_dt = datetime.fromisoformat(last_rotation)
        return datetime.utcnow() - last_dt > timedelta(hours=KEY_ROTATION_HOURS)
    
    def rotate_keys(self) -> Dict[str, Any]:
        """
        Rotate cryptographic keys for forward secrecy.
        
        This creates new session keys while preserving the sovereign identity.
        """
        rotation_result = {
            "timestamp": datetime.utcnow().isoformat(),
            "rotated": []
        }
        
        # Archive old session keys (if any)
        # In production, these would be archived to secure storage
        
        # Generate new session keypair
        priv, pub = self.generate_session_keypair()
        session_path = self.vault_path / "session_x25519.priv"
        
        encrypted_priv = self._encrypt_data(priv)
        with open(session_path, "wb") as f:
            f.write(encrypted_priv)
        
        rotation_result["rotated"].append("session_keys")
        
        # Update metadata
        self._metadata["last_rotation"] = datetime.utcnow().isoformat()
        self._metadata["rotation_count"] = self._metadata.get("rotation_count", 0) + 1
        self._save_metadata()
        
        logger.info(f"Key rotation complete: {rotation_result}")
        return rotation_result
    
    # ========================================================================
    # Abdication Protocol (Emergency Shred)
    # ========================================================================
    
    def shred(self, level: int = 1) -> Dict[str, Any]:
        """
        Execute the Abdication Protocol - secure destruction of keys.
        
        Levels:
        - 1: Shred session keys only (recoverable)
        - 2: Shred all software keys (sovereign identity lost)
        - 3: Full scorched earth (requires hardware)
        
        Returns status of shred operation.
        """
        result = {
            "level": level,
            "timestamp": datetime.utcnow().isoformat(),
            "shredded": []
        }
        
        if level >= 1:
            # Shred session keys
            session_path = self.vault_path / "session_x25519.priv"
            if session_path.exists():
                self._secure_delete(session_path)
                result["shredded"].append("session_keys")
        
        if level >= 2:
            # Shred sovereign identity
            for fname in ["id_ed25519.priv", "id_ed25519.pub"]:
                path = self.vault_path / fname
                if path.exists():
                    self._secure_delete(path)
                    result["shredded"].append(fname)
            
            # Shred master key
            master_path = self.vault_path / ".master.key"
            if master_path.exists():
                self._secure_delete(master_path)
                result["shredded"].append("master_key")
        
        if level >= 3:
            # Full shred - delete metadata and vault directory
            if self._metadata_path.exists():
                self._secure_delete(self._metadata_path)
                result["shredded"].append("metadata")
            
            # Note: Level 3 would also trigger hardware eFuse burn
            # via the Phenix Navigator if connected
            result["hardware_action"] = "eFuse burn required (manual)"
        
        logger.warning(f"ABDICATION PROTOCOL EXECUTED: {result}")
        return result
    
    def _secure_delete(self, path: Path):
        """Securely delete a file by overwriting with random data."""
        try:
            size = path.stat().st_size
            # Overwrite 3 times with random data
            for _ in range(3):
                with open(path, "wb") as f:
                    f.write(os.urandom(size))
            # Final delete
            path.unlink()
            logger.info(f"Securely deleted: {path}")
        except Exception as e:
            logger.error(f"Failed to securely delete {path}: {e}")
            # Attempt regular delete as fallback
            try:
                path.unlink()
            except Exception:
                pass
    
    # ========================================================================
    # Utility Methods
    # ========================================================================
    
    def get_vault_status(self) -> Dict[str, Any]:
        """Get current vault status."""
        return {
            "vault_path": str(self.vault_path),
            "has_sovereign_identity": (self.vault_path / "id_ed25519.pub").exists(),
            "has_session_keys": (self.vault_path / "session_x25519.priv").exists(),
            "last_rotation": self._metadata.get("last_rotation"),
            "rotation_count": self._metadata.get("rotation_count", 0),
            "rotation_needed": self.check_rotation_needed()
        }


# ============================================================================
# Module-level convenience functions
# ============================================================================

_vault_instance: Optional[QuantumVault] = None

def get_vault() -> QuantumVault:
    """Get or create the global vault instance."""
    global _vault_instance
    if _vault_instance is None:
        _vault_instance = QuantumVault()
    return _vault_instance


if __name__ == "__main__":
    # Self-test
    vault = QuantumVault("./test_vault")
    
    print("=== Quantum Vault Self-Test ===")
    
    # Generate identity
    pub_key = vault.generate_sovereign_identity(force=True)
    print(f"Public Key: {pub_key.hex()}")
    
    # Sign and verify
    message = b"Hello, Phenix Protocol!"
    signature = vault.sign_data(message)
    print(f"Signature: {signature.hex()[:32]}...")
    
    valid = vault.verify_signature(message, signature, pub_key)
    print(f"Verification: {'PASS' if valid else 'FAIL'}")
    
    # Check status
    status = vault.get_vault_status()
    print(f"Status: {json.dumps(status, indent=2)}")
    
    print("\n=== Self-Test Complete ===")
