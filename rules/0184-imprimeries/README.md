# Imprimeries de labeur et industries graphiques — IDCC 184

> La version 2026.1 a été supprimée pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.

Le fichier 2026.1 entre en vigueur le **1er avril 2026**. Il modélise l'accord du 6 janvier 2026 relatif aux salaires, étendu par arrêté du 12 mars 2026 publié au Journal officiel le 19 mars 2026.

La valeur Publicodes est `imprimeries de labeur et industries graphiques`. Les règles sont sous `salarié . convention collective . imprimeries de labeur et industries graphiques`.

## Règles implémentées

Le salaire minimum conventionnel est un minimum mensuel brut pour 152,25 heures. Il est proratisé une seule fois par `salarié . contrat . temps de travail . quotité`.

| Groupe et échelon | Minimum mensuel |
|---|---:|
| `IB` | 4 515 € |
| `IA` | 4 401 € |
| `II` | 3 613 € |
| `IIIB` | 3 010 € |
| `IIIA` | 2 369 € |
| `IVB` | 2 232 € |
| `IVA` | 2 120 € |
| `VC` | 1 949 € |
| `VB` | 1 887 € |
| `VA` | 1 873 € |
| `VIB` | 1 859 € |
| `VIA` | 1 843 € |

Un groupe hors de cette grille est signalé par `groupe hors grille` et donne un minimum de `0 €/mois`, afin que l'application consommatrice traite l'absence de valeur plutôt que de supposer un salaire.

## Sources

- Accord du 6 janvier 2026 relatif aux salaires au 1er avril 2026, texte salaires IDCC 184 sur [Légifrance](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054040197).
- Arrêté du 12 mars 2026 portant extension, publié au JORF du 19 mars 2026.

## Limites

- Les minima antérieurs au 1er avril 2026 ne sont pas modélisés.
- Les primes, indemnités, salaires des apprentis et autres dispositions de la convention ne sont pas modélisés.
- Le modèle couvre uniquement les douze positions explicitement présentes dans la grille salariale publiée ; il ne déduit pas une position à partir d'un intitulé de poste.

## Financement du paritarisme

La révision 2026.2, à la date d'effet de la version 2026.1, ajoute `financement du paritarisme` : contribution des entreprises au dialogue social : 0,04 % de la masse salariale (article 2 de l'accord du 23 novembre 2015). Le plancher de 50 € et le plafond de 1 500 € par entreprise ne sont pas calculés ; le montant mensuel est une provision : 0,04 % du brut du mois (KALITEXT000032080921). Lu sur Légifrance le 9 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, en provision mensuelle ; la régularisation annuelle n'est pas calculée.
