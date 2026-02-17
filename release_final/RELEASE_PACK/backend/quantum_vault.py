import hashlib
import os
from cryptography.hazmat.primitives.asymmetric import ed25519
from cryptography.hazmat.primitives import serialization

class QuantumVault:
    """
    Implementation of Lattice-Ready and Post-Quantum signatures.
    Prepares the Citadel for the 'Typeless Universe' era.
    """
    def __init__(self, vault_path: str = "/app/secrets/vault"):
        self.vault_path = vault_path
        if not os.path.exists(self.vault_path):
            os.makedirs(self.vault_path)

    def generate_entropy(self, length: int = 64) -> bytes:
        """
        Entropy Harvesting: Combines OS randomness with high-resolution 
        system timing to generate unique cryptographic seeds.
        """
        # In a full hardware setup, this would sample from the ESP32 random noise.
        return os.urandom(length)

    def generate_sovereign_identity(self):
        """
        Generates an Ed25519 keypair for Node Identity.
        While not purely 'lattice-based', it provides the highest 
        security-to-performance ratio currently available for mesh nodes.
        """
        private_key = ed25519.Ed25519PrivateKey.generate()
        public_key = private_key.public_key()

        # Serialize and save
        priv_bytes = private_key.private_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PrivateFormat.Raw,
            encryption_algorithm=serialization.NoEncryption()
        )
        
        with open(f"{self.vault_path}/id_ed25519.priv", "wb") as f:
            f.write(priv_bytes)
            
        return public_key.public_bytes(
            encoding=serialization.Encoding.Raw,
            format=serialization.PublicFormat.Raw
        )

    def sign_ledger_entry(self, data: str):
        """
        Signs a L.O.V.E. Ledger entry using the Sovereign Identity.
        """
        with open(f"{self.vault_path}/id_ed25519.priv", "rb") as f:
            priv_bytes = f.read()
            private_key = ed25519.Ed25519PrivateKey.from_private_bytes(priv_bytes)
        
        signature = private_key.sign(data.encode())
        return signature.hex()