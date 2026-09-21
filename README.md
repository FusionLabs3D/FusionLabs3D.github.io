# FusionLabs3D — Specialized In-House 3D Printing & Prototyping

> **Engineering-Grade 3D Prototyping**  
> Functional parts • Engineering prototypes • Real-world applications.

Official production repository for the **FusionLabs3D** website, built with a high-precision engineering aesthetic inspired by Hubs, Siemens, and Autodesk. The platform delivers instant DFM guidance, mechanical datasheets, and direct RFQ capability.

---

## 🌐 Live Website & Channels

- **Live Website (GitHub Pages):** [https://fusionlabs3d.github.io/](https://fusionlabs3d.github.io/)
- **Technical Datasheets:** [https://fusionlabs3d.github.io/material.html](https://fusionlabs3d.github.io/material.html)
- **Instant RFQ Portal:** [https://fusionlabs3d.github.io/quote.html](https://fusionlabs3d.github.io/quote.html)
- **Instagram:** [@fusionlabs3d.india](https://www.instagram.com/fusionlabs3d.india/)
- **Direct Inquiries:** `solutions.fusionlabs3d@gmail.com`
- **Location:** Jaipur, Rajasthan, India

---

## 🧪 Calibrated Engineering Materials

FusionLabs3D prints in 9 calibrated polymers and continuous/chopped fiber composites:

| Material | Classification | Key Metrics | Primary Application |
|---|---|---|---|
| **PA-CF** | Structural Carbon Composite | 105 MPa Tensile, 150°C HDT, 7.2 GPa Modulus | Drone airframes, motor mounts, aluminum replacement |
| **PAHT-CF** | High-Temp Carbon Composite | 115 MPa Tensile, 194°C HDT, 8.4 GPa Modulus | High-load brackets, tooling jigs, autoclave fixtures |
| **PPA-CF** | Advanced Semi-Aromatic Composite | 145 MPa Tensile, 215°C HDT, 9.8 GPa Modulus | Formula SAE intake runners, UAV motor mounts, high-temp fluid manifolds |
| **PA-GF** | Glass-Fiber Reinforced Nylon | 85 MPa Tensile, 130°C HDT, 5.4 GPa Modulus | Wear plates, non-conductive electrical brackets |
| **PETG** | Functional Polyester Glycol | 50 MPa Tensile, 75°C HDT, 20% Elongation | Chemical ducting, fluid tanks, durable enclosures |
| **ABS** | High-Impact Terpolymer | 42 MPa Tensile, 85°C HDT, 10% Elongation | Mechanical brackets, gearboxes, snap-fit housings |
| **ASA** | UV & Weather Resistant | 44 MPa Tensile, 90°C HDT, 9% Elongation | Outdoor telemetry, marine sensor housings, solar mounts |
| **PLA** | Precision Biopolymer | 55 MPa Tensile, 55°C HDT, Rigid Profile | Concept models, rapid fit checks, non-load jigs |
| **TPU 95A** | Flexible Engineering Elastomer | 35 MPa Tensile, 450% Elongation, Shore 95A | Industrial gaskets, vibration dampers, robot grippers |

---

## 📁 Repository Structure

```
├── index.html              # Main landing page (showcase, material cards, specs matrix)
├── material.html           # Interactive technical datasheets & switcher
├── quote.html              # RFQ submission portal with direct Web3Forms delivery
├── data/
│   └── materials.json      # Centralized engineering material specifications database
├── style.css               # Engineering design system & responsive styling
├── script.js               # Carousel, category filters, theme toggler, and navigation
├── robots.txt              # Search engine directives
├── sitemap.xml             # Search index sitemap
├── favicon.ico             # Browser icon
├── README.md               # Documentation
└── assets/                 # Part photography, CAD schematics, and vector logos
```

---

## 💻 Local Development

Start a local HTTP server:
```powershell
cd e:\IoT\FusionLabs3D-Website
python -m http.server 3000
```
- **Local Site:** [http://localhost:3000](http://localhost:3000)
- **Material Datasheet:** [http://localhost:3000/material.html?mat=paht-cf](http://localhost:3000/material.html?mat=paht-cf)
- **RFQ Portal:** [http://localhost:3000/quote.html](http://localhost:3000/quote.html)

---

## 🚀 Deployment

The site is deployed via GitHub Pages from the `main` branch:
```powershell
git add .
git commit -m "Update site"
git push origin main
```
Changes go live worldwide via GitHub Pages CDN within 60 seconds.


