#!/usr/bin/env python3
"""Generate options.go from options.xml"""

import xml.etree.ElementTree as ET
import os

def generate_options():
    """Generate options.go from options.xml"""
    
    tree = ET.parse('data/chummerxml/options.xml')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/options.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains option structures generated from options.xml\n\n')
        
        # Generate Limb struct
        f.write('// Limb represents a limb count definition\n')
        f.write('type Limb struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tLimbCount int `xml:"limbcount" json:"limbcount"`\n')
        f.write('\tExclude string `xml:"exclude" json:"exclude"`\n')
        f.write('}\n\n')
        
        # Generate LimbCounts struct
        f.write('// LimbCounts represents a collection of limb counts\n')
        f.write('type LimbCounts struct {\n')
        f.write('\tLimb []Limb `xml:"limb" json:"limb"`\n')
        f.write('}\n\n')
        
        # Generate PDFAppNames struct
        f.write('// PDFAppNames represents a collection of PDF application names\n')
        f.write('type PDFAppNames struct {\n')
        f.write('\tAppName []string `xml:"appname" json:"appname"`\n')
        f.write('}\n\n')
        
        # Generate PDFArgument struct
        f.write('// PDFArgument represents a PDF argument definition\n')
        f.write('type PDFArgument struct {\n')
        f.write('\tName string `xml:"name" json:"name"`\n')
        f.write('\tValue string `xml:"value" json:"value"`\n')
        f.write('\tAppNames *PDFAppNames `xml:"appnames,omitempty" json:"appnames,omitempty"`\n')
        f.write('}\n\n')
        
        # Generate PDFArguments struct
        f.write('// PDFArguments represents a collection of PDF arguments\n')
        f.write('type PDFArguments struct {\n')
        f.write('\tPDFArgument []PDFArgument `xml:"pdfargument" json:"pdfargument"`\n')
        f.write('}\n\n')
        
        # Generate BlackMarketPipelineCategories struct
        f.write('// BlackMarketPipelineCategories represents a collection of black market pipeline categories\n')
        f.write('type BlackMarketPipelineCategories struct {\n')
        f.write('\tCategory []string `xml:"category" json:"category"`\n')
        f.write('}\n\n')
        
        # Generate Avail struct
        f.write('// Avail represents an availability mapping\n')
        f.write('type Avail struct {\n')
        f.write('\tID string `xml:"id" json:"id"`\n')
        f.write('\tValue float64 `xml:"value" json:"value"`\n')
        f.write('\tDuration int `xml:"duration" json:"duration"`\n')
        f.write('\tInterval string `xml:"interval" json:"interval"`\n')
        f.write('}\n\n')
        
        # Generate AvailMap struct
        f.write('// AvailMap represents a collection of availability mappings\n')
        f.write('type AvailMap struct {\n')
        f.write('\tAvail []Avail `xml:"avail" json:"avail"`\n')
        f.write('}\n\n')
        
        # Generate OptionsChummer struct (root element)
        f.write('// OptionsChummer represents the root chummer element for options\n')
        f.write('type OptionsChummer struct {\n')
        f.write('\tLimbCounts LimbCounts `xml:"limbcounts" json:"limbcounts"`\n')
        f.write('\tPDFArguments PDFArguments `xml:"pdfarguments" json:"pdfarguments"`\n')
        f.write('\tBlackMarketPipelineCategories BlackMarketPipelineCategories `xml:"blackmarketpipelinecategories" json:"blackmarketpipelinecategories"`\n')
        f.write('\tAvailMap AvailMap `xml:"availmap" json:"availmap"`\n')
        f.write('}\n\n')
    
    print("Generated options.go")

if __name__ == '__main__':
    print("Generating options from options.xml...")
    generate_options()
    print("Done!")

