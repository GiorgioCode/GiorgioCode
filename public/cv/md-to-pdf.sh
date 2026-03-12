#!/usr/bin/env bash
# Convierte los CV en Markdown a PDF (márgenes 1 cm, motor xelatex).
# Uso: ./md-to-pdf.sh   o   bash md-to-pdf.sh

set -e
cd "$(dirname "$0")"

pandoc jorge_paez_resume_en.md -o jorge_paez_resume_en.pdf --pdf-engine=xelatex \
  -V geometry="top=1cm, bottom=1cm, left=1cm, right=1cm"

pandoc jorge_paez_resume_es.md -o jorge_paez_resume_es.pdf --pdf-engine=xelatex \
  -V geometry="top=1cm, bottom=1cm, left=1cm, right=1cm"

echo "PDFs generados: jorge_paez_resume_en.pdf, jorge_paez_resume_es.pdf"
