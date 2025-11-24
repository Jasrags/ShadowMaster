package v5

// dataBooks contains all book definitions
var dataBooks = map[string]Book{
	"ap": {
		ID:   "289bc41d-6dd5-4216-9bc7-e6f0cabae9ac",
		Name: "Assassin's Primer",
		Code: "AP",
	},
	"gh3": {
		ID:   "b68175bc-e10f-4e11-9361-ed62bb371c8d",
		Name: "Gun Heaven 3",
		Code: "GH3",
	},
	"rg": {
		ID:   "5d6626a2-2400-44b5-b777-d7dac6cb512f",
		Name: "Run and Gun",
		Code: "RG",
	},
	"sr5": {
		ID:   "f5ec713c-98cd-41f6-a0a4-4a8eaed55b66",
		Name: "Shadowrun 5th Edition",
		Code: "SR5",
	},
	"sg": {
		ID:   "3976dc50-f7db-481d-9372-fc2a5c1178ce",
		Name: "Street Grimoire",
		Code: "SG",
	},
	"sge": {
		ID:   "ee63bbc5-2abd-4543-8371-457044bc7c63",
		Name: "Street Grimoire Errata",
		Code: "SGE",
	},
	"bb": {
		ID:   "d7b60868-41ee-4970-b9f2-f1a2a81b6d1a",
		Name: "Bullets & Bandages",
		Code: "BB",
	},
	"sass": {
		ID:   "7c37e671-9d0c-48f6-aa61-891a38be18d8",
		Name: "Sail Away, Sweet Sister",
		Code: "SASS",
	},
	"ss": {
		ID:   "ab9fd70c-6b79-4780-ae3d-dfa5f1624c9d",
		Name: "Stolen Souls",
		Code: "SS",
	},
	"rf": {
		ID:   "0b2e86c9-98b7-4265-800f-9f1b98ce7f96",
		Name: "Run Faster",
		Code: "RF",
	},
	"ssp": {
		ID:   "01994ce6-832f-4e29-aded-e16c1bf139bd",
		Name: "Shadow Spells",
		Code: "SSP",
	},
	"np": {
		ID:   "07bfdff7-1331-4791-9334-6b299548f8f4",
		Name: "Nothing Personal",
		Code: "NP",
	},
	"dt": {
		ID:   "c8358d1c-2eb0-461b-9e2f-b3490ad0011d",
		Name: "Data Trails",
		Code: "DT",
	},
	"dtd": {
		ID:   "0b082117-8eb2-42d1-82e3-11454536c480",
		Name: "Data Trails (Dissonant Echoes)",
		Code: "DTD",
	},
	"cf": {
		ID:   "cea24b81-209b-49b2-afe4-62f1286e508e",
		Name: "Chrome Flesh",
		Code: "CF",
	},
	"ht": {
		ID:   "B6642AC0-7E72-44C4-B954-3E224EBB2E64",
		Name: "Hard Targets",
		Code: "HT",
	},
	"blb": {
		ID:   "73cbd0f7-9a44-480b-8143-5c93d0b1cdf3",
		Name: "Bloody Business",
		Code: "BLB",
	},
	"shb": {
		ID:   "bb5c7e4e-431b-404f-89da-e69cf3b75d50",
		Name: "Schattenhandbuch (German-Only)",
		Code: "SHB",
	},
	"shb2": {
		ID:   "8798c923-8118-448e-b201-53d299d7e58c",
		Name: "Schattenhandbuch 2 (German-Only)",
		Code: "SHB2",
	},
	"shb3": {
		ID:   "08dea2f1-3add-4516-bdbe-b47ab9a5e31f",
		Name: "Schattenhandbuch 3 (German-Only)",
		Code: "SHB3",
	},
	"shb4": {
		ID:   "e1f426ff-e35a-4ddd-a168-11faec92d3b6",
		Name: "Schattenhandbuch 4 (German-Only)",
		Code: "SHB4",
	},
	"r5": {
		ID:   "a1055d3f-7bc1-4ca3-a005-681c54a046a1",
		Name: "Rigger 5.0",
		Code: "R5",
	},
	"hs": {
		ID:   "38de6863-2911-4fa6-9a43-70db72ab8a22",
		Name: "Howling Shadows",
		Code: "HS",
	},
	"tvg": {
		ID:   "2fba52dd-bc97-450f-9d07-e1d86885911d",
		Name: "The Vladivostok Gauntlet",
		Code: "TVG",
	},
	"sps": {
		ID:   "6b37230a-dd55-4c3f-882d-0a1c6324a457",
		Name: "Splintered State",
		Code: "SPS",
	},
	"sfb": {
		ID:   "58b3ffae-7320-4b11-8c50-db92b7f0452b",
		Name: "Shadows In Focus: Butte",
		Code: "SFB",
	},
	"hks": {
		ID:   "7186ed14-e0b8-456e-b923-f77933f1762e",
		Name: "Hong Kong Sourcebook",
		Code: "HKS",
	},
	"lcd": {
		ID:   "540cfaa8-823f-46c7-b93b-79191a894bd1",
		Name: "Lockdown",
		Code: "LCD",
	},
	"sfm": {
		ID:   "81c02566-af38-45e3-9e46-3b1d083f84f2",
		Name: "Shadows In Focus: San Francisco Metroplex",
		Code: "SFM",
	},
	"sfme": {
		ID:   "ad384a90-33c2-40bd-b128-37117d02f36c",
		Name: "Shadows In Focus: Metropole",
		Code: "SFME",
	},
	"ca": {
		ID:   "40515dbc-fec6-4530-ba79-959cc8c54c61",
		Name: "Cutting Aces",
		Code: "CA",
	},
	"2050": {
		ID:   "71a6304e-03dc-41db-be01-a86acab1517b",
		Name: "Shadowrun 2050 (German-Only)",
		Code: "2050",
	},
	"pbg": {
		ID:   "5b97fd1f-08d4-4ce9-99a8-d6a0c70b5bdc",
		Name: "Parabotany (German-Only)",
		Code: "PBG",
	},
	"pgg": {
		ID:   "d7c0c5eb-0900-431c-9852-edcc86b03f67",
		Name: "Parageology (German-Only)",
		Code: "PGG",
	},
	"pzg": {
		ID:   "e5b9d556-d084-418d-a2d2-2d5b45b2dede",
		Name: "Parazoology (German-Only)",
		Code: "PZG",
	},
	"botl": {
		ID:   "485cc0ae-8221-4d5e-a527-33df76fd1f21",
		Name: "Book of the Lost",
		Code: "BOTL",
	},
	"fa": {
		ID:   "6e447106-e250-41b1-855a-2dd1d2075f6d",
		Name: "Forbidden Arcana",
		Code: "FA",
	},
	"sag": {
		ID:   "c6b7136f-e461-457b-b6f7-09e95c2f6313",
		Name: "State of the Art ADL (German-Only)",
		Code: "SAG",
	},
	"tct": {
		ID:   "c4392cc2-8edd-4ae3-8198-b8c00e693c8b",
		Name: "The Complete Trog",
		Code: "TCT",
	},
	"sfcc": {
		ID:   "e894804c-2e11-489e-acc8-f9691a79b261",
		Name: "Shadows In Focus: Sioux Nation: Counting Coup",
		Code: "SFCC",
	},
	"dtr": {
		ID:   "c74e950e-3554-4a44-9060-5a2840302538",
		Name: "Dark Terrors",
		Code: "DTR",
	},
	"tsg": {
		ID:   "42d5ed10-66e8-47de-8685-851fdfdcae35",
		Name: "The Seattle Gambit",
		Code: "TSG",
	},
	"sl": {
		ID:   "bfe6c53b-1c68-4d7a-b11d-9d47461df1cd",
		Name: "Street Lethal",
		Code: "SL",
	},
	"kc": {
		ID:   "35f513da-865a-45ce-a8f9-eb0336e47427",
		Name: "Kill Code",
		Code: "KC",
	},
	"hamg": {
		ID:   "6c97c3e8-8f13-43aa-b692-6218983c9396",
		Name: "Datapuls Hamburg (German-Only)",
		Code: "HAMG",
	},
	"btb": {
		ID:   "612af603-65e6-442c-91b8-8b8cc0c77e4a",
		Name: "Better Than Bad",
		Code: "BTB",
	},
	"aet": {
		ID:   "be47e4b5-cc4f-427a-b4cd-cb5c1c8821ce",
		Name: "Aetherology",
		Code: "AET",
	},
	"nf": {
		ID:   "e65d69fd-8717-4e2b-88b0-73bf7a22bca0",
		Name: "No Future",
		Code: "NF",
	},
	"sotg": {
		ID:   "b20a20e5-e9d4-4f54-9caa-57a001cb904e",
		Name: "Datapuls SOTA 2080 (German-Only)",
		Code: "SOTG",
	},
	"soxg": {
		ID:   "a43010ac-7b1a-420f-ab72-1644ee57ed7a",
		Name: "Datapuls SOX 2080 (German-Only)",
		Code: "SOXG",
	},
	"kk": {
		ID:   "e997ea2e-916b-4482-a381-bf8c49cb08ff",
		Name: "Krime Katalog",
		Code: "KK",
	},
	"srm0803": {
		ID:   "2ca3c7ce-3cdb-4bf2-b430-32ecef09fda1",
		Name: "Shadowrun Missions 0803: 10 Block Tango",
		Code: "SRM0803",
	},
	"srm0804": {
		ID:   "9d69b598-4f46-46d0-be44-dd3fd8a915b0",
		Name: "Shadowrun Missions 0804: Dirty Laundry",
		Code: "SRM0804",
	},
	"qsr": {
		ID:   "dd13ad69-51d3-4938-b4e9-703da8ee8e41",
		Name: "Shadowrun Quick-Start Rules",
		Code: "QSR",
	},
	"ge": {
		ID:   "d7ac8252-fc5d-42d2-afca-2cf98ec14287",
		Name: "Grimmes Erwachen (German-Only)",
		Code: "GE",
	},
	"sw": {
		ID:   "775703af-df57-4ee2-b8e7-c6b829b80539",
		Name: "Sprawl Wilds",
		Code: "SW",
	},
	"sfmo": {
		ID:   "d90bad82-303e-4c0b-b00b-f8649af99db6",
		Name: "Shadows In Focus: Morocco",
		Code: "SFMO",
	},
	"sfcr": {
		ID:   "00178f4e-b682-4742-b259-7c086b18bc95",
		Name: "Shadows In Focus: Casablanca-Rabat",
		Code: "SFCR",
	},
	"datg": {
		ID:   "bd1e6ed4-5ae2-4745-8444-ba89630fd940",
		Name: "Datapuls Österreich (German-Only)",
		Code: "DATG",
	},
	"grst2019": {
		ID:   "0f4619da-b7d9-4b62-81b6-20734267623c",
		Name: "Der Almanach – Gratisrollenspieltag 2019 (German-Only)",
		Code: "GRST2019",
	},
	"slg2": {
		ID:   "71405233-c42c-46c7-b387-f5baae3c9e64",
		Name: "Schattenload 2 (German-Only)",
		Code: "SLG2",
	},
	"slg3": {
		ID:   "5295c4f3-53d6-4406-b5dc-79ffe54f7a4f",
		Name: "Schattenload 3 (German-Only)",
		Code: "SLG3",
	},
	"slg7": {
		ID:   "0851f253-fd27-4a66-ae56-10721d8be5e4",
		Name: "Schattenload 7 (German-Only)",
		Code: "SLG7",
	},
}
