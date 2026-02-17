# Commissioning a SIC-POVM QKD Security Proof for ETSI Certification

A formal security proof for your SIC-POVM-based QKD protocol against coherent attacks is achievable through established academic pathways, with the **Tavakoli et al. 2020 SIC compound paper** providing a directly adaptable framework and the **Generalized Entropy Accumulation Theorem** offering the most suitable proof technique. ETSI QKD 016 certification requires EAL4+ Common Criteria evaluation with composable security proofs, and typical commissioned proof projects span **1-3 years** at costs comparable to EAL4 evaluations (**$1-2.5M**). The most promising collaborators are **IQC Waterloo** (documented contract research experience) and **ETH Zurich** (invented the entropy accumulation framework).

---

## The tetrahedral geometry has existing cryptographic foundations

Your protocol's use of 4 symmetric non-orthogonal states forming a regular tetrahedron inscribed in the Bloch sphere—with pairwise overlaps of **|⟨ψᵢ|ψⱼ⟩|² = 1/3**—corresponds exactly to the qubit SIC-POVM structure established by Renes, Blume-Kohout, Scott, and Caves in 2004. Critically, this geometry has **already been analyzed for QKD security** in two key papers:

**Tavakoli, Bengtsson, Gisin & Renes (2020)** published "Compounds of symmetric informationally complete measurements and their application in quantum key distribution" in *Physical Review Research*. This paper demonstrates that SIC-based QKD protocols can achieve security against general attacks and shows these protocols **outperform the six-state protocol** under certain noise conditions. The proof technique uses covariance under automorphism groups and treats sifting as a quantum operation via isometry—directly applicable to your protocol.

**The Singapore Protocol** (Englert, Kaszlikowski et al., 2008-2015) uses qubit SIC-POVM measurements for entanglement-based QKD. Security derives from **tomographic completeness**: any eavesdropping manifests as detectable deterioration in state tomography. This aligns precisely with your approach of distinguishing isotropic depolarization from anisotropic deformation.

Research from Science.gov confirms that protocols with tetrahedral alphabet have the **highest critical error rate** among protocols considered (absent basis reconciliation), meaning your geometry offers optimal noise tolerance for qubit systems.

---

## Academic groups with proven non-BB84 proof expertise

The following groups have published security proofs for non-BB84 QKD protocols between 2020-2025 and possess the expertise needed for your SIC-POVM analysis:

### Tier 1: Recommended for commissioning

**ETH Zurich – Renato Renner Group** (Institute for Theoretical Physics) invented the entropy accumulation theorem and its generalization, which form the foundation for modern finite-size security proofs. Joseph M. Renes at ETH published the 2020 SIC compound QKD paper directly analyzing SIC-POVM geometries. Key publications include "Security of quantum key distribution from generalised entropy accumulation" (2022) and extensive work on device-independent protocols. The group has developed general frameworks applicable to arbitrary QKD protocols.

**IQC Waterloo – Norbert Lütkenhaus Group** has the most documented track record of industry-commissioned security proof research, including the **Qu-Gov project** funded by Bundesdruckerei GmbH (German Federal Printing Office) for QKD certification analysis. Lütkenhaus serves as **Vice-Chair of ETSI ISG-QKD** and co-organizes the annual ETSI/IQC Quantum Safe Cryptography Conference. The group specializes in practical protocol security analysis, numerical convex optimization methods, and reference-frame-independent protocols for satellite applications.

**University of Connecticut – Walter O. Krawec** publishes analytical (non-numerical) security proofs for high-dimensional protocols with non-standard measurements. His 2024-2025 papers address protocols where Alice/Bob cannot use full mutually unbiased bases—**directly relevant to SIC-POVM's restricted measurement geometry**. Methods include quantum sampling frameworks and entropic uncertainty relations for biased measurements.

### Tier 2: Strong theoretical expertise

**NUS CQT Singapore** (Scarani, Lim, Tomamichel groups) pioneered device-independent QKD security and high-dimensional entropic bounds. Published the 2022 *Nature* paper on device-independent QKD for distant users and comprehensive reviews of DI-QKD security.

**IQOQI Vienna** (Huber, Kanitschar) published composable finite-size security proofs for high-dimensional QKD in 2025, using semi-analytic methods that avoid computationally demanding convex optimization—important for practical certification work.

---

## Proof techniques ranked by suitability for SIC-POVM geometry

| Technique | Suitability | Key Advantage | Primary Developers |
|-----------|-------------|---------------|-------------------|
| **Generalized EAT** | **Excellent** | Dimension-independent; handles prepare-and-measure directly | Metger, Renner, Fawzi, Sutter (ETH) |
| **Devetak-Winter** | **Excellent** (asymptotic) | Fundamental rate bound for any geometry | Winter (Barcelona), Lütkenhaus (Waterloo) |
| **Postselection/de Finetti** | Good | Converts collective→coherent attack security | Christandl, König, Renner |
| **Entropic Uncertainty** | Moderate | Conceptually simple | Coles, Berta, Tomamichel, Wehner |

The **Generalized Entropy Accumulation Theorem (GEAT)** emerges as the optimal choice because it is dimension-independent (bounds depend only on classical outputs, not Hilbert space dimension), directly handles prepare-and-measure protocols without conversion to entanglement-based versions, requires no permutation symmetry assumption, and has been applied to non-BB84 protocols including B92 (first tight finite-size proof, 2023) and discrete-modulated CV-QKD.

**De Finetti reductions** face unfavorable scaling with Hilbert space dimension and require explicit symmetrization steps. **Entropic uncertainty relations** can yield trivial bounds for POVMs (maximum overlap equals 1), though SIC-POVM's symmetry may allow specialized analysis.

The recommended approach combines GEAT for finite-size security against general attacks with Devetak-Winter analysis for asymptotic key rates, following the template established in the Tavakoli et al. SIC compound paper.

---

## ETSI QKD 016 certification demands composable security against coherent attacks

ETSI GS QKD 016 (V2.1.1, January 2024) is the world's first Protection Profile for QKD modules, certified by Germany's BSI (Certificate BSI-CC-PP-0120-2024). The standard applies to pairs of "Prepare and Measure" QKD modules and requires:

**Security proof requirements:**
- Information-theoretic security proofs demonstrating resistance to **coherent attacks** (defined as "the most general type of eavesdropping attack where an adversary interacts multiple ancillas coherently with QKD signals and performs a joint measurement")
- **Composable security** per Müller-Quade and Renner's framework (*New J. Phys.* 11, 085006, 2009)
- Security parameter upper limits documented according to the "associated composed security proof"

**Assurance level:** EAL4 augmented by AVA_VAN.5 (high attack resistance vulnerability analysis requiring defense against attackers with "high attack potential") and ALC_DVS.2 (development security measures).

**Documentation deliverables:**
- Security Target (ST) conformant to the Protection Profile
- Composable security proof for the implemented protocol
- TOE Summary Specification understandable to non-QKD experts
- User and administrator guidance documentation

Related standards include ETSI GS QKD 005 ("Security Proofs") and ISO/IEC 23837-1/-2 (security requirements and test methods).

---

## Cost, timeline, and collaboration models for commissioned proofs

Exact costs for commissioned QKD security proofs are not publicly disclosed, but related data provides context:

**Cost estimates:**
- Common Criteria EAL4 evaluations (comparable to QKD 016 requirements): **$1-2.5 million** based on historical vendor reports
- EU OpenQKD project (comprehensive QKD research including certification): **€15 million** over 3 years across 38 partners
- Academic security proof research contracts: Typically structured as multi-phase sponsored research agreements

**Timeline expectations:**
- Novel protocol security proofs: **1-3+ years** for complete analysis
- Security evaluation cycle (assessment, testing, patching, re-evaluation): **1-2 years**
- Full ETSI certification path: Multi-year process (ETSI ISG-QKD took 15 years from founding to first Protection Profile)

**Deliverable formats:**
- Mathematical security proofs (published as academic papers)
- Security evaluation reports with vulnerability categorization
- Protection Profile-conformant Security Targets
- Implementation-specific security analysis documentation

**Industry-academic collaboration models:**

The **Qu-Gov project** demonstrates the standard model: Bundesdruckerei GmbH (German Federal Printing Office) funded multi-phase security proof research at IQC Waterloo under oversight from Germany's Federal Ministry of Finance. This represents a direct contract research arrangement between government/industry clients and academic quantum security groups.

**ID Quantique** (spin-off from University of Geneva) maintains ongoing security evaluation relationships with Vadim Makarov's quantum hacking team (now at IQC Waterloo), which has tested commercial systems including ID Quantique Clavis3 and QuantumCTek products.

The **UK Quantum Communications Hub** facilitates ISCF (Industrial Strategy Challenge Fund) projects connecting commercial partners with academic security research.

---

## Existing proofs adaptable to your tetrahedral geometry

### Directly applicable

**SIC Compound Protocol (Tavakoli et al., Phys. Rev. Research 2020):** Security proof for SIC-based QKD against general attacks using Latin square structures and automorphism group covariance. Key result: SIC protocols exceed six-state protocol performance under certain noise conditions.

**Singapore Protocol:** Entanglement-based QKD using qubit SIC-POVM with tomographic completeness for eavesdropping detection—**identical to your proposed detection mechanism**.

### Adaptable with modification

**Reference-Frame-Independent QKD (Laing et al., 2010; Sheridan et al., 2010):** Uses rotationally invariant parameter construction C = ⟨σx⊗σx⟩² + ⟨σy⊗σy⟩² + ⟨σz⊗σz⟩². Your SIC-POVM's tetrahedral symmetry enables similar invariant parameters under depolarizing noise. Three-state RFI-QKD proven secure against coherent attacks (Liu et al., 2019).

**Six-State Protocol:** Establishes **~12.62% QBER threshold** baseline; tetrahedral geometry should exceed this due to higher symmetry and optimal noise tolerance.

**Composable HD-QKD (Vienna group, 2025):** Semi-analytic method for finite-key security without high-dimensional convex optimization—applicable methodology for your protocol.

### Adaptation pathway

Your proof should combine: (1) Invariant parameter construction from RFI-QKD, (2) Covariance arguments from SIC compound paper, (3) Tomographic completeness detection from Singapore protocol, (4) GEAT/Rényi framework for finite-key coherent attack security, (5) Six-state noise threshold as benchmark to exceed.

---

## Publication venues appropriate for security proof dissemination

### Premier conferences

**QCrypt** (Annual Conference on Quantum Cryptography): The **definitive venue** for QKD security proofs. Non-archival proceedings allow subsequent journal submission. 2024 held in Vigo, Spain.

**CRYPTO/EUROCRYPT** (IACR flagship conferences): A* ranked, Springer LNCS proceedings, rigorous peer review. Ideal for composable security proofs with formal cryptographic rigor.

**TQC** (Theory of Quantum Computation, Communication and Cryptography): Strong venue for foundational theoretical proofs.

**IEEE Quantum Week**: 1600+ registrants, explicitly covers quantum cryptography/QKD. Good for applied security proofs with implementation relevance.

### Top physics journals

**PRX Quantum** (IF ~9.4): **Recommended primary target**—open access, high impact, focused on quantum information. Published major QKD security papers.

**Physical Review Letters** (IF ~8.1): For breakthrough results only; highly selective.

**Physical Review A** (IF ~2.9): **Excellent for detailed proofs**—covers atomic/optical physics and quantum science; standard venue for QKD security analyses.

**npj Quantum Information** (IF ~6.8): Nature group, open access, published "Advances in device-independent QKD."

### Strategic approach

Publish the mathematical proof in **CRYPTO/EUROCRYPT** (cryptographic community) or **PRX Quantum/PRA** (physics community), present at **QCrypt** for visibility, and ensure the proof explicitly addresses ETSI QKD 016 composability requirements to support certification.

---

## Contact information and institutional pathways

### ETH Zurich – Renato Renner Group

- **Website:** https://qit.ethz.ch/
- **Prof. Dr. Renato Renner:** +41 44 633 34 58
- **Industry partnerships:** ETH Quantum Center (https://qc.ethz.ch/industry/partnerships.html)
- **Partnership contact:** Through ETH Quantum Center website
- **Strengths:** Invented entropy accumulation theorem; Joseph Renes published SIC-POVM QKD paper

### IQC Waterloo – Norbert Lütkenhaus Group

- **Website:** https://uwaterloo.ca/institute-for-quantum-computing/
- **Prof. Norbert Lütkenhaus (Executive Director):**
  - Office email: lutkenhaus.office@uwaterloo.ca
  - Confidential: nlutkenhaus@uwaterloo.ca
  - Phone: (519) 888-4567 ext. 32870
- **Industry partnerships:** https://uwaterloo.ca/institute-for-quantum-computing/info-for/government-industry-partners-tour-iqc
- **Strengths:** Vice-Chair ETSI ISG-QKD; documented Bundesdruckerei contract research; practical certification experience

### NUS CQT Singapore

- **Website:** https://www.quantumlah.org/
- **Key faculty:** Prof. Valerio Scarani (QKD theory), Prof. Charles Lim (HD-QKD)
- **PhD/collaboration contact:** cqtphd@nus.edu.sg
- **Industry partnerships:** National Quantum Office coordinates industry engagement under S$300M National Quantum Strategy
- **Strengths:** DI-QKD expertise; 8 spin-off companies; SpeQtral quantum communications company

### University of Geneva

- **Website:** https://www.unige.ch/gap/qic/
- **Key faculty:** Prof. Nicolas Gisin (Emeritus, ID Quantique founder), Prof. Wolfgang Tittel
- **Collaboration pathway:** Geneva Quantum Centre (https://gqc.unige.ch/)
- **Strengths:** Pioneer institution; direct pathway to ID Quantique expertise

### IQOQI Vienna

- **Website:** https://iqoqi-vienna.at/
- **Key faculty:** Prof. Marcus Huber, Prof. Rupert Ursin
- **Collaboration pathway:** Vienna Center for Quantum Science and Technology (https://vcq.quantum.at/)
- **Strengths:** HD-QKD finite-key proofs; Anton Zeilinger's experimental QKD legacy

### University of Connecticut – Walter Krawec

- **Key researcher:** Prof. Walter O. Krawec (Computer Science)
- **Strengths:** Analytical proofs for protocols without standard MUB symmetries; directly relevant to non-standard measurement geometries

---

## Recommended engagement strategy

**Primary approach:** Contact **IQC Waterloo** (Norbert Lütkenhaus) first due to documented contract research experience, ETSI certification involvement, and practical QKD security focus. The Bundesdruckerei precedent demonstrates this group accepts commissioned security analysis projects.

**Secondary approach:** Engage **ETH Zurich** through the Quantum Center industry partnership program for theoretical depth, particularly given Joseph Renes' direct SIC-POVM QKD work.

**Proof framework:** Request adaptation of the Tavakoli et al. SIC compound analysis combined with GEAT-based finite-size security, ensuring explicit ETSI QKD 016 composability compliance.

**Timeline expectation:** 18-36 months for complete composable security proof against coherent attacks suitable for certification documentation.

**Budget planning:** Anticipate costs in the **$500K-2M range** depending on scope, based on comparable EAL4+ security evaluation benchmarks and multi-year academic research contracts.