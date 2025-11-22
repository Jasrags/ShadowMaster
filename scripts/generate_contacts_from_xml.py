#!/usr/bin/env python3
"""Generate contacts.go from contacts.xml"""

import xml.etree.ElementTree as ET
import os

def generate_contacts():
    """Generate contacts.go from contacts.xml"""
    
    tree = ET.parse('data/chummerxml/contacts.xml')
    root = tree.getroot()
    
    os.makedirs('pkg/shadowrun/edition/v5', exist_ok=True)
    
    # Generate the Go code
    with open('pkg/shadowrun/edition/v5/contacts.go', 'w', encoding='utf-8') as f:
        f.write('package v5\n\n')
        f.write('// This file contains contact structures generated from contacts.xml\n\n')
        
        # Generate Contacts struct
        f.write('// Contacts represents a collection of contact types\n')
        f.write('type Contacts struct {\n')
        f.write('\tContact []string `xml:"contact" json:"contact"`\n')
        f.write('}\n\n')
        
        # Generate Genders struct
        f.write('// Genders represents a collection of gender options\n')
        f.write('type Genders struct {\n')
        f.write('\tGender []string `xml:"gender" json:"gender"`\n')
        f.write('}\n\n')
        
        # Generate Ages struct
        f.write('// Ages represents a collection of age options\n')
        f.write('type Ages struct {\n')
        f.write('\tAge []string `xml:"age" json:"age"`\n')
        f.write('}\n\n')
        
        # Generate PersonalLives struct
        f.write('// PersonalLives represents a collection of personal life options\n')
        f.write('type PersonalLives struct {\n')
        f.write('\tPersonalLife []string `xml:"personallife" json:"personallife"`\n')
        f.write('}\n\n')
        
        # Generate ContactTypes struct
        f.write('// ContactTypes represents a collection of contact types\n')
        f.write('type ContactTypes struct {\n')
        f.write('\tType []string `xml:"type" json:"type"`\n')
        f.write('}\n\n')
        
        # Generate PreferredPayments struct
        f.write('// PreferredPayments represents a collection of preferred payment options\n')
        f.write('type PreferredPayments struct {\n')
        f.write('\tPreferredPayment []string `xml:"preferredpayment" json:"preferredpayment"`\n')
        f.write('}\n\n')
        
        # Generate HobbiesVices struct
        f.write('// HobbiesVices represents a collection of hobby/vice options\n')
        f.write('type HobbiesVices struct {\n')
        f.write('\tHobbyVice []string `xml:"hobbyvice" json:"hobbyvice"`\n')
        f.write('}\n\n')
        
        # Generate ContactsChummer struct (root element)
        f.write('// ContactsChummer represents the root chummer element for contacts\n')
        f.write('type ContactsChummer struct {\n')
        f.write('\tContacts Contacts `xml:"contacts" json:"contacts"`\n')
        f.write('\tGenders Genders `xml:"genders" json:"genders"`\n')
        f.write('\tAges Ages `xml:"ages" json:"ages"`\n')
        f.write('\tPersonalLives PersonalLives `xml:"personallives" json:"personallives"`\n')
        f.write('\tTypes ContactTypes `xml:"types" json:"types"`\n')
        f.write('\tPreferredPayments PreferredPayments `xml:"preferredpayments" json:"preferredpayments"`\n')
        f.write('\tHobbiesVices HobbiesVices `xml:"hobbiesvices" json:"hobbiesvices"`\n')
        f.write('}\n\n')
    
    print("Generated contacts.go")

if __name__ == '__main__':
    print("Generating contacts from contacts.xml...")
    generate_contacts()
    print("Done!")

