# Security and threat analysis for SIC-POVM tetrahedral QKD systems

The Phenix Navigator faces a complex threat landscape where theoretical attacks on non-orthogonal states intersect with practical implementation vulnerabilities in lithium niobate photonics. The most critical finding is that **unambiguous state discrimination (USD) attacks specifically exploit the linear independence of SIC-POVM states**, while a newly discovered **induced-photorefraction attack (IPA)** poses an existential threat to all lithium niobate-based QKD modulators. No dedicated security proof exists for SIC-POVM-based QKD protocols, creating an urgent need for formal cryptographic analysis before deployment.

---

## Non-orthogonal state protocols face targeted cryptanalytic attacks

The tetrahedral SIC-POVM geometry's defining characteristic—its symmetric non-orthogonal states with constant overlap—creates specific vulnerabilities distinct from BB84-style protocols. The foundational attack framework was established by Dušek, Jahma, and Lütkenhaus in Physical Review A 62, 022306 (2000), demonstrating that linearly independent signal states enable eavesdroppers to perform unambiguous state discrimination even when the protocol appears secure against beam-splitting attacks.

The most dangerous recent development is the **combined Laser Damage Attack (LDA) plus USD attack** documented by Sushchev and colleagues at Moscow in Scientific Reports 15, Article 44820 (December 2025). When attenuation alteration exceeds **10-20 dB**, Eve can implement intercept-resend attacks using off-the-shelf technology to obtain the entire secret key. Their pseudo-photon-number resolution (PPNR) USD attack is fully undetectable even with advanced statistical monitoring—a critical concern for practical SIC-POVM deployments.

For protocols using symmetric non-orthogonal states like the six-state protocol, Bruß established in Physical Review Letters 81, 3018-3021 (1998) that optimal incoherent eavesdropping reduces to a universal quantum cloning machine. The security bound for the trine (three-state) protocol—which represents a 2D analog of tetrahedral SIC-POVM geometry—was proven at **9.81% bit error rate** compared to 11% for BB84, reflecting the geometric trade-off inherent in non-orthogonal encoding. Recent work by Englert and colleagues (arXiv:0910.5375) on reference-frame-free protocols using trine states provides a template for extending security analysis to the full tetrahedral case.

The **photon number splitting attack** has advanced from theoretical to practical implementation. Ashkenazy and colleagues demonstrated in Advanced Quantum Technologies 7, 2300437 (2024) an experimental scheme using single-photon Raman interaction (SPRINT) in cavity-enhanced atomic systems, introducing small but non-zero QBER that could evade detection. Higher-dimensional non-orthogonal state protocols show inherent PNS resistance, suggesting the tetrahedral geometry may offer some protection, but this requires formal verification.

---

## Four-detector implementations introduce compounded vulnerabilities

Implementation attacks against multi-detector QKD systems apply directly to SIC-POVM tetrahedral geometries, with the complexity multiplied by the four-outcome measurement structure. The detector efficiency mismatch attack framework established by Makarov, Anisimov, and Skaar in Physical Review A 74, 022313 (2006) demonstrates that when efficiency mismatch between any pair of detectors exceeds approximately **15:1**, Eve can construct successful faked-states attacks with QBER below 11%. A four-detector SIC-POVM implementation inherently has **four times the potential mismatch vectors** compared to standard two-detector BB84.

The **calibration process itself presents an attack surface**. Fei and colleagues documented in Scientific Reports 8, 4283 (2018) a quantum man-in-the-middle attack where Eve intercepts calibration signals to induce large temporal basis-dependent detector efficiency mismatch. Maintaining perfect tetrahedral symmetry under such calibration manipulation is extraordinarily difficult, as any induced asymmetry between the four POVM elements can be exploited.

Dead-time attacks pose particular risks for high-speed SIC-POVM implementations. Weier and colleagues at LMU Munich demonstrated in New Journal of Physics 13, 073024 (2011) that multi-photon faked states can trigger specific detectors, causing them to enter dead-time periods during which they cannot detect subsequent signals. With four detectors, Eve can strategically disable three detectors via dead-time manipulation, forcing deterministic outcomes for the remaining active detector. Attack efficiency scales directly with detector dead-time duration relative to pulse rate.

The **InGaAs SPAD detectors specified for Phenix Navigator** are vulnerable to backflash attacks. Shi and colleagues from the Kurtsiefer group at NUS documented in Optics Express 25(24), 30388 (2017) that these detectors emit fluorescence (1000-1600 nm) during avalanche breakdown with approximately **0.4% detection probability**, creating at least 0.04 photons per detection event. In a SIC-POVM setup, this backflash reveals which POVM outcome occurred.

Detector blinding remains the most mature attack vector. Lydersen and colleagues demonstrated in Nature Photonics 4, 686-689 (2010) complete key recovery on commercial systems using bright CW laser illumination that saturates InGaAs APDs into linear mode. For four-detector SIC-POVM setups, the attack requires simultaneously blinding all detectors—analyzed specifically for four-detector DDI-QKD in Scientific Reports 7, 531 (2017). Recent countermeasure testing by Acheva and colleagues in EPJ Quantum Technology 10, 22 (2023) found that pulsed blinding attacks can evade photocurrent monitoring countermeasures across a wide range of pulse durations and powers.

---

## Lithium niobate photonics reveal critical side-channel vulnerabilities

The MgO:TFLN photonic integrated circuit presents the most severe vulnerability in the Phenix Navigator architecture. Ye and colleagues at USTC published in Physical Review Applied 19, 054052 (May 2023) the **induced-photorefraction attack (IPA)**—the first demonstrated attack exploiting the photorefractive effect inherent to all lithium niobate materials. Eavesdroppers can inject an irradiation beam as low as **3 nW** into LN-based modulators, causing photogenerated charge redistribution that creates a space-charge electric field. This modifies the refractive index via the Pockels effect, biasing the modulator response curve without detection.

While MgO doping increases photorefractive damage threshold, **no published work has verified whether MgO:TFLN specifically mitigates IPA**. The attack applies to all individual and on-chip LN devices, and commercial LN-based variable optical attenuators and Mach-Zehnder modulators have been confirmed vulnerable. Countermeasures require insertion losses exceeding **100 dB** in optical paths using scattering-based fiber optical attenuators combined with isolator sequences, plus voltage-locking mechanisms at transmitter modulators.

The attack extends to continuous-variable protocols. A September 2024 preprint (arXiv:2409.08017) demonstrated IPA on CV-QKD systems, showing that induced photorefraction biases modulator response curves to enable Eve to hide classical intercept-resend attacks while causing overestimation of secret key rate. Additional research (arXiv:2404.03956, April 2024) found that IPA efficiency increases as wavelength decreases into the 400-800 nm range—relevant for the 405nm pump laser in Phenix Navigator's SPDC source.

**Electromagnetic emanation attacks using deep learning** represent an emerging threat. Baliuka and colleagues at LMU Munich published in Physical Review Applied 20, 054040 (2023) that RF emissions from QKD sender module electronics (FPGAs, VCSEL drivers) can be analyzed using convolutional neural networks to recover **virtually all information about the secret key** in some scenarios. The ESP32-S3 control plane in Phenix Navigator requires rigorous EM shielding; signals from unshielded QKD receivers can be detected at distances up to **50 m** according to EPJ Quantum Technology (2024) assessment.

Power analysis attacks on integrated CVQKD systems documented in Entropy 23(2), 176 (2021) use Support Vector Regression machine learning to extract keys from power consumption patterns of integrated electrical control circuits. The ESP32-S3 microcontroller's power signature during state preparation represents a potential leakage channel that requires randomization through Dynamic Voltage and Frequency Scaling (DVFS) technology.

Trojan horse attacks against photonic integrated circuits require **232 dB isolation** for chip-based MDI-QKD resistance according to Physical Review Applied 15, 064038 (2021). Strategic placement of amplitude modulators relative to back-reflecting components and high-speed switching can reduce information leakage windows. Recent analysis (arXiv:2408.16835, August 2024) from EPSRC Quantum Hubs provides comprehensive THA assessment for MDI-QKD integrated InP chips applicable to similar TFLN architectures.

---

## Security proof landscape reveals critical gap for SIC-POVM protocols

**No published security proof exists specifically for SIC-POVM-based QKD protocols**, representing a fundamental gap that must be addressed before Phenix Navigator deployment. However, existing frameworks from leading research groups can be adapted to provide finite-key composable security analysis.

The **Waterloo group** led by Norbert Lütkenhaus has developed the OpenQKDSecurity numerical framework capable of analyzing arbitrary discrete-variable QKD protocols. Their convex optimization approach documented in Nature Communications 7, 11712 (2016) and improved SDP-based methods in Quantum 2, 77 (2018) are protocol-agnostic and can directly analyze SIC-POVM configurations. Key personnel include Devashish Tupkary, Ernest Y.-Z. Tan, and Jie Lin, with dimension reduction techniques (PRX Quantum 2021) applicable to the four-dimensional tetrahedral case.

The **ETH Zurich group** under Renato Renner provides the Generalised Entropy Accumulation Theorem (GEAT) framework published in Nature Communications 14, 5272 (2023). This proves that security against general attacks reduces to collective attacks for generic prepare-and-measure protocols—directly applicable to SIC-POVM QKD without requiring protocol-specific analysis.

The **Vienna group** led by Marcus Huber has published the most directly relevant work: composable finite-size security for high-dimensional QKD protocols in Physical Review Applied (2025) and Physical Review Letters 135, 010802 (2025). Their framework handles experimentally accessible measurements using min-entropy bounds via guessing probability methods, avoiding the need for full MUB measurements. The dimension d=4 tetrahedral case falls within their framework's scope.

**Alexey Rastegin at Irkutsk State University** has published foundational entropic uncertainty relations for SIC-POVMs in Physica Scripta 89, 085101 (2014) and European Physical Journal D 67, 269 (2013). His Maassen-Uffink type uncertainty bounds for SIC-POVMs provide the mathematical foundation that would underpin any dedicated security proof. The min-entropy bounds are directly applicable to finite-key security analysis when combined with Renner's composable framework.

The security proof landscape for qudit protocols was established by Sheridan and Scarani at NUS Singapore in Physical Review A 82, 030301(R) (2010), providing finite-key bounds for d-dimensional protocols using MUBs. Their techniques extend to symmetric non-orthogonal state sets with modification.

---

## International standards ecosystem extends well beyond ETSI and NIST

The most comprehensive QKD network standards come from **ITU-T Study Group 13**, which has published over 20 recommendations in the Y.3800 series covering functional requirements, architecture, key management, control and management, SDN integration, quality of service, and interworking. Key documents include Y.3800-Y.3810 published between 2019-2022, with Y.Sup70 addressing machine learning applications. The lead editor Hyung-Soo Kim (KT, Korea) coordinates these efforts.

**ISO/IEC JTC 1/SC 27** published the first international security evaluation framework for QKD in September 2023: ISO/IEC 23837-1:2023 and ISO/IEC 23837-2:2023 apply Common Criteria paradigms to QKD security evaluation including discrete-variable, continuous-variable, prepare-and-measure, and entanglement-based protocols. These standards specify Security Functional Requirements for quantum optical components and protocol implementations.

**South Korea operates the world's first national QKD security certification program**, launched in 2023 through collaboration between NIS, NSR, KRISS, TTA, and ITSCC. ID Quantique's Clavis XG received the first certification in 2024, and KT's domestically manufactured equipment was certified in 2025. The Korean Post-Quantum Cryptography (KpqC) Competition concluded in January 2025 with HAETAE and AIMer selected for digital signatures, plus SMAUG-T and NTRU+ for key establishment.

**China has the strongest national QKD standards ecosystem** with GB/T 42829-2023, GB/T 43692-2024, YD/T 3834.1-2021, and GM/T 0108-2021 covering terminology, system requirements, and commercial cryptography specifications. TC260 working groups WG3 (cryptographic technology) and WG6 (communication security) coordinate these efforts. China Communications Standards Association (CCSA-ST7) drives industry standardization since 2017.

**Japan's NICT** operates the Tokyo QKD Network (world's first multi-vendor interoperable testbed since 2010) and led development of ITU-T Y.3800 series recommendations. AIST's Cyber Physical Security Research Institute conducts joint research on post-quantum cryptography and tamper resistance under NEDO grants with University of Tokyo, Mitsubishi Electric, and PQShield.

**IEEE has published P1913** (Software-Defined Quantum Communication, 2016) and **P7131** (Quantum Computing Performance Metrics, 2021), with active projects P1943 (Post-Quantum Network Security), P3172 (PQC Migration Recommended Practice), and P7130 (Quantum Computing Definitions). The Quantum Computing Benchmarking Working Group chaired by Erik DeBenedictis coordinates technical scope.

**CEN-CENELEC JTC 22 on Quantum Technologies** was established in March 2023 with WG 4 covering Quantum Communication and Quantum Cryptography. Chair Oskar van Deventer (TNO Netherlands) coordinates with QuIC (European Quantum Industry Consortium), which represents 160+ members and publishes position papers and patent landscape analyses.

---

## Mobile QKD patent landscape creates freedom-to-operate considerations

The foundational IP for portable QKD devices is held by **Los Alamos National Laboratory** through US Patent 9,002,009 B2 (filed September 2010, expires September 2032). This patent covers miniaturized QC transmitters in card form factors that couple with base stations for QKD with trusted authorities. Claims include integrated electro-optical modules producing **four non-orthogonal polarization states** (0°, 45°, 90°, 135°), memory storing keys produced from QC, and packaging in smartphones or mobile computing devices. The patent family extends to EP2622783B1, ES2827723T3, and JP2013543338A. Continuation patent US 9,680,641 B2 adds fillgun functionality claims.

**Toshiba's chip-scale QKD** represents the most advanced commercial implementation. Published in Nature Photonics (2021) by Paraïso and colleagues, their system uses quantum transmitter chips measuring **2×6mm** packaged in CFP2 modules achieving up to 100 Gbps secure data transfer in 1U rackmount form factors. Their hybrid integration approach combining InP electro-optic phase modulators with ultra-low-loss SiN waveguides achieves **1.82 Mbps secure bit rates** over 10 dB channel attenuation with positive key rates to 250 km fiber.

**KETS Quantum Security** (University of Bristol spinout) has developed the most directly comparable handheld technology. Their Q-DOS Light project achieved a **750g quantum transmitter** for drone applications under 2kg weight limits. With £1.7M Innovate UK funding and BT telecom network testing, they target IoT, telecommunications, and defense markets. Their silicon integrated chips offer standard semiconductor foundry manufacturing.

Academic progress toward miniaturization includes a **handheld transmitter under 150 ml volume, 65g weight, and 3.15W power** demonstrated by Rarity and colleagues at University of Bristol in EPJ Quantum Technology (2021), achieving peak key rates exceeding 20 kbps at 80 MHz qubit transmission over free-space optical links. A separate integrated optics module measuring 35×20×8mm using NIR faint polarized laser pulses at 100 MHz was demonstrated compatible with smartphone technology.

Recent drone-based QKD demonstrations (arXiv:2505.17587v1, 2025) using polarization encoding with RC-LED sources at 12.5 MHz have achieved drone-to-drone QKD at approximately 10m altitude with modular transmitter/receiver systems incorporating pointing-and-tracking capabilities.

---

## Critical countermeasures and recommended mitigations

For **lithium niobate photorefractive vulnerabilities**, implement optical isolation exceeding 100 dB using cascaded scattering-based fiber optical attenuators combined with isolators, voltage-locking mechanisms on transmitter modulators, and spectral monitoring for unauthorized wavelengths. Verify experimentally whether MgO doping provides meaningful IPA resistance before relying on this property.

For **detector-based attacks**, the detector self-testing approach documented in APL Photonics 10, 016106 (2025) uses random "salt" optical events from controlled light emitters for black-box verification. Random switching of bit assignments to detectors can eliminate efficiency mismatch effects. Photocurrent monitoring provides partial protection against blinding but requires pulsed attack testing across broad parameter ranges.

For **electromagnetic emanation**, implement EM shielding barriers around the ESP32-S3 control plane and SPAD electronics, limit distances between SPADs and control circuits, integrate all circuitry onto single shielded boards, and employ low-EM-emissions circuit design. Power consumption randomization through DVFS technology addresses power analysis vulnerabilities.

For **security proofs**, engage the Vienna group (Huber) to apply their HD QKD framework to d=4 SIC-POVM, implement protocols in Waterloo's OpenQKDSecurity for numerical key rate analysis, and combine Rastegin's entropic bounds within Renner's composable security framework. This collaboration would produce the first dedicated SIC-POVM QKD security analysis.

For **standards compliance**, prioritize ISO/IEC 23837-1/2 conformance for international markets, pursue South Korean NIS certification for Asia-Pacific deployment, engage CEN-CENELEC JTC 22 WG 4 for European regulatory alignment, and monitor ITU-T Y.3800 series evolution for network integration requirements.

For **freedom-to-operate**, conduct detailed claims analysis of Los Alamos US 9,002,009 B2 focusing on encoding methods (tetrahedral vs. four non-orthogonal polarization states at 0°/45°/90°/135°), integration approaches (MgO:TFLN vs. bulk electro-optical modules), and control architecture (ESP32/NXP SE050 vs. patent-specified implementations). The SIC-POVM tetrahedral geometry differs sufficiently from the polarization basis encoding in the Los Alamos patent to potentially avoid infringement, but formal patent counsel review is essential.

---

## Conclusion

The Phenix Navigator QKD system operates in a threat landscape where theoretical vulnerabilities in non-orthogonal state protocols intersect with practical implementation attacks on photonic integrated circuits and detectors. The **induced-photorefraction attack on lithium niobate** represents the most immediate technical risk requiring experimental mitigation verification. The **absence of dedicated SIC-POVM security proofs** creates regulatory and certification obstacles that must be addressed through collaboration with the Vienna, Waterloo, or ETH groups. The **Los Alamos portable QKD patent family** requires freedom-to-operate analysis before commercial deployment. Engagement with South Korea's certification program offers the most advanced path to national security approval, while ISO/IEC 23837 conformance provides international market access.