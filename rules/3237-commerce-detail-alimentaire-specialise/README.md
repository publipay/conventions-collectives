# Commerce de détail alimentaire spécialisé — IDCC 3237

> Les versions 2026.1, 2026.2 et 2026.3 ont été supprimées pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne les choisissait plus. Les passages qui les citent retracent l’historique des règles reprises par les versions suivantes.

Le fichier 2026.1 est applicable au 17 avril 2026, date d'entrée en vigueur après l'extension de l'avenant n° 9 du 13 janvier 2026 relatif aux salaires minima conventionnels. Le fichier 2026.2 est applicable au 1er octobre 2026, après l'extension de l'avenant n° 10 du 16 juin 2026.

La convention collective nationale des métiers du commerce de détail alimentaire spécialisé du 12 janvier 2021 (brochure 3387) couvre les entreprises relevant de l'IDCC 3237.

## Règles implémentées

- `niveau` reçoit les niveaux E1 à E7, AM1, AM2, C1 ou C2.
- `salaire minimum conventionnel` donne le salaire minimum mensuel pour 35 heures, proratisé selon la quotité de travail.
- `salaire minimum annuel forfait jours` donne le minimum annuel des cadres C1 et C2 pour 218 jours, selon l'ancienneté dans le niveau.
- `niveau hors grille` vaut vrai pour une classification absente de la grille ; le salaire retourné est alors `0 €/mois`.

## Grille 2026.1

| Niveau | Minimum mensuel |
|---|---:|
| E1 | 1 838,81 € |
| E2 | 1 858,76 € |
| E3 | 1 878,72 € |
| E4 | 1 906,35 € |
| E5 | 1 935,51 € |
| E6 | 1 957,00 € |
| E7 | 2 010,72 € |
| AM1 | 2 445,10 € |
| AM2 | 2 518,77 € |
| C1 | 3 052,92 € |
| C2 | 3 425,90 € |

## Grille 2026.2 — applicable au 1er octobre 2026

| Niveau | Minimum mensuel |
|---|---:|
| E1 | 1 875,01 € |
| E2 | 1 896,66 € |
| E3 | 1 913,02 € |
| E4 | 1 940,81 € |
| E5 | 1 970,14 € |
| E6 | 1 991,76 € |
| E7 | 2 047,34 € |
| AM1 | 2 488,93 € |
| AM2 | 2 564,58 € |
| C1 | 3 108,07 € |
| C2 | 3 487,90 € |

Forfait jours (218 jours) : C1 38 722 € pendant les 24 premiers mois puis 40 760 € ; C2 45 855 € pendant les 24 premiers mois puis 50 950 €.

## Sources officielles

- [Avenant n° 9 du 13 janvier 2026 relatif aux salaires minima conventionnels — Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054164742)
- [Avenant n° 10 du 16 juin 2026 relatif aux salaires minima — texte étendu par arrêté du 7 septembre 2026, NOR TRST2622492A, publié au Journal officiel du 19 septembre 2026]
- [Arrêté du 2 avril 2026 portant extension de l'avenant n° 9 — Journal officiel](https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000051486313), publié le 16 avril 2026, NOR TRST2609047A.

## Limites

- Les grilles mensuelles et le minimum annuel des cadres au forfait jours sont modélisés ; les autres dispositions de la convention ne le sont pas.
- Les versions antérieures au 17 avril 2026 ne sont pas incluses.
- La grille est limitée aux classifications explicitement publiées dans l'annexe de l'avenant ; aucune classification supplémentaire n'est extrapolée.
- Le passage automatique E1 vers E2 après six mois d'ancienneté doit être pris en compte dans la classification fournie ; il n'est pas déduit automatiquement sans donnée de changement de niveau.

## Financement du paritarisme

La révision 2026.3, à la date d'effet de la version 2026.2, ajoute `financement du paritarisme` : la cotisation annuelle des employeurs à l'association paritaire : 0,15 % des salaires entrant dans l'assiette des cotisations de sécurité sociale (article 4 de l'accord du 19 mai 2021, KALITEXT000044085496, étendu par arrêté du 17 septembre 2021). Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`. Le montant mensuel est une provision sur le brut du mois ; la régularisation annuelle n'est pas calculée.

## Contribution conventionnelle de formation

Les révisions 2026.4 (version 2026.1) et 2026.5 (version 2026.3), à la date d'effet de chaque version, ajoutent `formation professionnelle conventionnelle` : contribution conventionnelle supplémentaire de formation professionnelle : 0,15 % de la masse salariale sous 20 salariés, 0,60 % de 20 à 49, 0,70 % à partir de 50 (article 24.1 de l'accord du 19 avril 2021). Le montant mensuel est une provision sur le brut du mois (KALITEXT000044065250). Lu sur Légifrance le 9 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, à côté de la contribution légale ; la régularisation annuelle n'est pas calculée.
