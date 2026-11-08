# Professions de la photographie — IDCC 3168

Le fichier [2024.1](3168-professions-photographie.2024.1.publicodes) entre en vigueur le 1er mars 2024 ; il lie les entreprises non adhérentes aux organisations signataires à partir du 1er juin 2024. Salaires minima mensuels de l'avenant du 15 février 2024 ; les premiers coefficients sont sous le SMIC de 2026.

La valeur Publicodes est `photographie` ; les règles sont sous `salarié . convention collective . photographie`.

## Règles implémentées

- `coefficient` : Coefficient de 150 à 450 de la grille.
- `salaire minimum conventionnel` : minimum brut à temps plein de la grille (mensuel), multiplié par `salarié . contrat . temps de travail . quotité` de modele-social ; le montant ne doit donc pas être proratisé une seconde fois.
- `coefficient hors grille` signale une classification absente de la grille (minimum à 0).

## Limites

- Seuls les minima de salaire sont modélisés : primes, majorations, maintien de salaire, indemnités de rupture, santé et prévoyance ne le sont pas.
- Le SMIC reste un plancher à appliquer par le moteur de paie lorsque le minimum conventionnel lui est inférieur.

## Sources

- Avenant du 15 février 2024 relatif aux salaires minima, article 1er (salaires minima mensuels bruts pour 151,67 heures, coefficients 150 à 450), applicable le 1er mars 2024 aux entreprises adhérentes aux organisations signataires et, pour les autres, le premier jour du mois suivant la publication de l'arrêté d'extension (arrêté du 13 mai 2024, JORF du 31 mai 2024), soit le 1er juin 2024. Aucun accord de salaires postérieur n'est publié sur Légifrance au 2 novembre 2026.
- https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000049605869
- Convention collective nationale des professions de la photographie du 13 février 2013, conteneur KALICONT000027961162.

## Financement du paritarisme

La révision 2024.2, à la date d'effet de la version 2024.1, ajoute `financement du paritarisme` : contribution des entreprises au financement de l'amélioration de la négociation et de l'information : 0,05 % de la masse salariale brute (accord du 12 juin 2007). Le minimum annuel n'est pas calculé (KALITEXT000018562985). Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, en provision mensuelle ; la régularisation annuelle n'est pas calculée.
