package main

import (
	"fmt"
	"os"
	"strings"

	"shadowmaster/pkg/shadowrun/edition/v5"
	"shadowmaster/pkg/shadowrun/edition/v5/loader"
)

func main() {
	data, err := loader.LoadContactsFromXML("data/chummerxml/contacts.xml")
	if err != nil {
		fmt.Fprintf(os.Stderr, "Error loading XML: %v\n", err)
		os.Exit(1)
	}

	code := generateContactsDataCode(data)

	outputPath := "pkg/shadowrun/edition/v5/contacts_data.go"
	if err := os.WriteFile(outputPath, []byte(code), 0644); err != nil {
		fmt.Fprintf(os.Stderr, "Error writing file: %v\n", err)
		os.Exit(1)
	}

	fmt.Printf("✓ Generated %s\n", outputPath)
	fmt.Printf("  Contacts: %d, Genders: %d, Ages: %d, PersonalLives: %d, Types: %d, Payments: %d, Hobbies: %d\n",
		len(data.Contacts.Contact),
		len(data.Genders.Gender),
		len(data.Ages.Age),
		len(data.PersonalLives.PersonalLife),
		len(data.Types.Type),
		len(data.PreferredPayments.PreferredPayment),
		len(data.HobbiesVices.HobbyVice))
}

func generateContactsDataCode(data *v5.ContactsChummer) string {
	var b strings.Builder

	b.WriteString("package v5\n\n")
	b.WriteString("import \"shadowmaster/pkg/shadowrun/edition/v5/common\"\n\n")
	b.WriteString("// Code generated from contacts.xml. DO NOT EDIT.\n\n")
	b.WriteString("var contactsData = &ContactsChummer{\n")

	// Contacts
	b.WriteString("\tContacts: ContactTypesList{\n")
	b.WriteString("\t\tContact: []string{\n")
	for _, contact := range data.Contacts.Contact {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", contact))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// Genders
	b.WriteString("\tGenders: Genders{\n")
	b.WriteString("\t\tGender: []string{\n")
	for _, gender := range data.Genders.Gender {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", gender))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// Ages
	b.WriteString("\tAges: Ages{\n")
	b.WriteString("\t\tAge: []string{\n")
	for _, age := range data.Ages.Age {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", age))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// PersonalLives
	b.WriteString("\tPersonalLives: PersonalLives{\n")
	b.WriteString("\t\tPersonalLife: []common.PersonalLife{\n")
	for _, pl := range data.PersonalLives.PersonalLife {
		b.WriteString(fmt.Sprintf("\t\t\tcommon.PersonalLife(%q),\n", string(pl)))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// Types
	b.WriteString("\tTypes: ContactTypes{\n")
	b.WriteString("\t\tType: []string{\n")
	for _, t := range data.Types.Type {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", t))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// PreferredPayments
	b.WriteString("\tPreferredPayments: PreferredPayments{\n")
	b.WriteString("\t\tPreferredPayment: []string{\n")
	for _, payment := range data.PreferredPayments.PreferredPayment {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", payment))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	// HobbiesVices
	b.WriteString("\tHobbiesVices: HobbiesVices{\n")
	b.WriteString("\t\tHobbyVice: []string{\n")
	for _, hv := range data.HobbiesVices.HobbyVice {
		b.WriteString(fmt.Sprintf("\t\t\t%q,\n", hv))
	}
	b.WriteString("\t\t},\n")
	b.WriteString("\t},\n")

	b.WriteString("}\n\n")

	b.WriteString("// GetContactsData returns the loaded contacts data.\n")
	b.WriteString("func GetContactsData() *ContactsChummer {\n")
	b.WriteString("\treturn contactsData\n")
	b.WriteString("}\n")

	return b.String()
}

