package v5

// dataContacts contains all contact definitions
var dataContacts = map[string]Contact{
	"bartender": {
		Name: "Bartender",
		Uses: []string{
			"Information",
			"Additional contacts",
			"Back rooms for private meets",
		},
		PlacesToMeet: "Any bar/nightclub",
		SimilarContacts: []string{
			"Bar/nightclub owner",
			"Bouncer",
			"Waitress",
			"Stripper",
		},
		Description: "Bartenders serve drinks. They also serve as counselor and crying shoulder to nearly everyone who comes into their joint. They see and hear just about everything, which is why it's so very important to make his acquaintance and make his tip jar a little heavier. Bartenders know everyone, so they'll be able to let you know who hasn't been in for a while, whose kid has run away from home this time, whose wife is screwing some other guy—just about anything you might need to know. He can also connect you to the local rumor mill, and he might have something juicy that one of his clients let slip in a haze of gin and tonic. He can guide newbies to suppliers of a variety of goods and services. It'll all cost you, of course—sometimes straight-up cred, sometimes a round for the house to keep the good will flowing. He's known for his discretion, however. He won't just spill to anyone without a really good reason. Like we said, it'll cost you … but it's usually worth it to keep him (and sometimes his other customers) happy.",
		Source:      "SR5",
	},
	"beat_cop": {
		Name: "Beat Cop",
		Uses: []string{
			"Information",
			"Additional contacts",
			"Gear",
		},
		PlacesToMeet: "The streets of his beat, coffee shops",
		SimilarContacts: []string{
			"Detective",
			"Snitch",
			"Undercover cop",
			"Rent-a-cop",
		},
		Description: "They've walked the cold streets of their beat for more years than they care to remember, and they've seen everything that happens there. Newcomers and old-timers, BTL dens and gang turf—he's got the skinny on all of it, and what he doesn't know now, he will soon enough. His network of snitches will make sure of that. If you're good to him, he might even share. Some beat cops patrol on foot, some in cars or on motorcycles. Some of them, especially in some towns in the NAN, even patrol on horseback. Some are straight shooters, and some of them would sell their own mothers if the price was right. The key to working with the beat cop is to know what makes him tick. Find out what he wants and help him get it. He'll repay you with a wealth of information, or arrange meetings with people when you need it.",
		Source:      "SR5",
	},
	"fixer": {
		Name: "Fixer",
		Uses: []string{
			"Jobs and cred",
			"Information",
			"Gear",
			"Additional contacts",
		},
		PlacesToMeet: "Local bars or clubs, coffee shops, street corners where surveillance is next to impossible",
		SimilarContacts: []string{
			"Fence",
			"Loan shark",
			"Mr. Johnson",
		},
		Description: "If you know nobody else, make the acquaintance of a fixer. They are the center of the shadowrunning universe, and they know everyone you might need to know. Find one, get on his good side, and you'll have a shot at prospering in the shadows. He can get you anything you need … for a price. After all, nothing's free in the shadows. Fixers are only as good as their connections, which they go to great lengths to cultivate. They're a one-man combination of employment agency, procurement firm, and fence. They make their living on whom and what they know, and by how well they can make deals between interested parties looking to buy or sell goods and services. A shadowrunner has something hot that he needs to unload pronto? The fixer's the man he needs to see. Mr. Johnson needs a team to extract someone from a competitor's compound? The fixer's the man who sets up the meeting. A team needs a specialist to pull off a tricky run? You guessed it; the fixer knows who to call. These kinds of services don't come cheap, however. A fixer takes a percentage from every transaction, and the better he is, the bigger that cut is going to be. Once you've found a quality fixer, stay on his good side. You might get a discount if he likes you, and even better, you might get another job without having to relocate to another city and start all over again.",
		Source:      "SR5",
	},
	"mafia_consiglieri": {
		Name: "Mafia Consiglieri",
		Uses: []string{
			"Information",
			"Additional contacts",
		},
		PlacesToMeet: "Restaurants, casinos, bars",
		SimilarContacts: []string{
			"Yakuza wakagashira",
			"Triad Incense Master",
		},
		Description: "There are occasions in the shadows when one must ask a favor of the local Mafia don. Of course, one does not simply walk into the don's office, at least not intact. To see the man on the throne, you speak to the power behind the throne, the don's consiglieri, or counselor. He is not actually a member of the family, but he has access to their secrets by dint of being the don's most trusted advisor. This confidence gives him information and insight on the family's business, their plans, and their mindset. He's also not a fool. These confidences aren't given up lightly, since his life would be worthless if the family got wind of their secrets being told out of school. You'll have to offer him something of value to the family to get that information. Help him deal with a problem that the family shouldn't touch on its own, or paydata on its enemies, and he'll be happy to reward you appropriately. Betray his trust, and he'll likewise be happy to reward you appropriately. The consiglieri typically holds a traditional job outside the family business. Many of them are, perhaps not surprisingly, lawyers.",
		Source:      "SR5",
	},
	"mechanic": {
		Name: "Mechanic",
		Uses: []string{
			"Repair services",
			"Used wheels, and other vehicles",
		},
		PlacesToMeet: "Local garage, gas station, automobile chop shop, used car lot, aircraft hangar",
		SimilarContacts: []string{
			"Tech wizard",
		},
		Description: "Sometimes, the only thing between a shadowrunner and disaster is a vehicle that moves like a scalded cat. To keep your vehicles in that category, it's good to know a mechanic. A good mechanic can fix what's broken and improve what's not. Given sufficient time and cash, he can make the worst junkyard refugee into a serviceable vehicle. The more miraculous the work, of course, the more it's going to cost you. As often as not, \"hopeless case\" can simply be read as \"very expensive.\" He also doubles as a car salesman, or at least an agent for one. If you need a quick, cheap set of wheels, a new drone, or that sweet new motorcycle you've been lusting over, he knows someone who can get it for you.",
		Source:      "SR5",
	},
	"mr_johnson": {
		Name: "Mr. Johnson",
		Uses: []string{
			"Shadowruns",
			"Job-related information",
			"Additional contacts",
		},
		PlacesToMeet: "Just about anywhere he wants",
		SimilarContacts: []string{
			"Company man",
			"Fixer",
			"Government agent",
		},
		Description: "For someone who doesn't officially exist, Mr. Johnson sure gets around. And that's just as well, since without him, all shadowrunners would be out of a job. He's the man between the shadows and the corps, and he's the one who gets the whole thing started. He's the one who gets his hands dirty so the corps and the governments don't have to. He helps put the \"deniable\" into deniable assets. Mr. Johnson runs the meeting, hires the talent, and pays for results. He gives you the information you need to do the job he's hiring you for, or at least the information he believes you're going to need. He can also get you some of the specialty items you might need to complete the job. He has deep connections and a long memory. While he has a reputation for double-crossing his assets, a lot of that is urban legend. Treat him well, and he'll generally return the favor. Screw him, though, and you might find yourself the target of one of his shadowruns somewhere down the line.",
		Source:      "SR5",
	},
	"street_doc": {
		Name: "Street Doc",
		Uses: []string{
			"Medical care",
			"Information",
			"Additional contacts",
			"Gear (drugs)",
		},
		PlacesToMeet: "Local clinic, body shop",
		SimilarContacts: []string{
			"EMT",
			"Ambulance driver",
			"Street mage/shaman",
		},
		Description: "Traditional medical treatment, for a shadowrunner, is not always a convenient choice. There's a great deal of paperwork, after all. It's times like this when knowing a street doc can be the difference between breathing for another day and becoming ghoul chow. Street docs operate out of local clinics and body-mod shops, and they don't ask a lot of questions. They have comparatively reasonable rates. They might not have an actual medical degree. Street docs are, often as not, med-school dropouts, nurses, or former combat medics. Beggars can't be choosers in the shadows, though, and if you're bleeding profusely and legitimate medical care is out of the question, your choice is pretty clear. Not only will they put you back together, but many street docs will also rebuild you. Many of them have cyberware installation as one of their income streams. It's often used ware, salvaged from runners who didn't make it, but it's usually a pretty good deal in terms of price. Keep your street doc happy. He'll cut you a better deal, you'll get treated better, and he'll be a lot less likely to kill you on the table and sell your parts to organleggers and other shadowrunners.",
		Source:      "SR5",
	},
	"talismonger": {
		Name: "Talismonger",
		Uses: []string{
			"Magical items",
			"Magic-related information",
			"Additional contacts",
		},
		PlacesToMeet: "Talismonger's shop, occult library, coffee shop",
		SimilarContacts: []string{
			"Fixer",
			"Street mage/shaman",
			"Corporate wagemage",
		},
		Description: "The Awakened are exceedingly rare, but they're still like other consumers. They have their special needs: magical foci, fetishes, ritual supplies and components. Fortunately, there are people out there equipped to meet those needs. Talismongers see just about everyone in the area with any sort of magical talent pass through their shops sooner or later. This makes them a great source of not just magical equipment, but vital information about what's going on in the local Awakened community. It also means they're the ones to go to if you need the services of a good street mage. Many talismongers are also enchanters, enabling them to provide shadowrunners with custom magical gear. They can also be good to have around when you need to know if that talisman you lifted on your last job is real or a mass-produced geegaw from a sweatshop in Hong Kong. One word of advice, though: Don't piss them off. They're great people to have on your side, but you make them mad and you might just find your last purchase has run out of mojo right when you really need it.",
		Source:      "SR5",
	},
}
