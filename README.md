# DevOps Sorting Package – CI/CD Pipeline

[![CI](https://github.com/<YOUR-USERNAME>/<YOUR-REPO>/actions/workflows/ci.yml/badge.svg)](https://github.com/<YOUR-USERNAME>/<YOUR-REPO>/actions)

## Overview
This repository implements a Python package that provides three sorting algorithms—**Bubble Sort**, **Quick Sort**, and **Insertion Sort**—each instrumented to measure a different system performance metric using `psutil`. The project follows a full DevOps CI/CD workflow, including automated testing, linting, formatting, performance measurement, and multi-platform GitHub Actions pipelines.

---

## Features

### Sorting Algorithms
| Algorithm          | Metric Measured | Description                                      |
|--------------------|-----------------|--------------------------------------------------|
| Bubble Sort        | CPU Usage       | Measures CPU consumption throughout execution    |
| Quick Sort         | Runtime         | Measures algorithm execution time                |
| Insertion Sort     | Memory Usage    | Measures memory allocation during sorting        |

All algorithms follow consistent Python docstring conventions and are located in `sort_lib/`.

---

## Development Tools & Frameworks
- **pytest** – automated testing  
- **flake8** – style & lint checking  
- **black** – code formatting  
- **psutil** – system metrics  
- **GitHub Actions** – CI/CD automation  
- **pre-commit** – local linting, formatting, security checks  

---

## CI/CD Workflow

A GitHub Actions pipeline (located in `.github/workflows/ci.yml`) runs:

### Linting & Formatting
- black (formatting)
- flake8 (linting)
- file size checks
- AWS/private key detection via pre-commit

### Automated Testing
- pytest runs on all sorting algorithms  
- validates correctness & performance  

### Multi-Platform Matrix Build
Tested across:

- **OS:** Ubuntu, macOS, Windows  
- **Python Versions:** 3.9, 3.10  

### Optional Deployment
A TestPyPI upload job can be enabled, requiring a unique package suffix.

---

## Performance Comparison

| OS      | Python Version | Bubble (CPU%) | Quick (ms) | Insertion (Memory KB) |
|---------|----------------|----------------|-------------|-------------------------|
| Ubuntu  | 3.9            | …              | …           | …                       |
| Ubuntu  | 3.10           | …              | …           | …                       |
| macOS   | 3.9            | …              | …           | …                       |
| macOS   | 3.10           | …              | …           | …                       |
| Windows | 3.9            | …              | …           | …                       |
| Windows | 3.10           | …              | …           | …                       |

---

## Installation
```bash
pip install .
