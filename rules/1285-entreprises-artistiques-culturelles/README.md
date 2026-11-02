# Entreprises artistiques et culturelles (emplois non artistiques) — IDCC 1285

Le fichier [2026.1](1285-entreprises-artistiques-culturelles.2026.1.publicodes) entre en vigueur le 1er août 2026 ; il lie les entreprises non adhérentes aux organisations signataires à partir du 19 septembre 2026. Minima mensuels des emplois non artistiques au 1er août 2026 ; les artistes (cachets, services, minima mensuels) ne sont pas modélisés.

La valeur Publicodes est `entreprises artistiques et culturelles` ; les règles sont sous `salarié . convention collective . entreprises artistiques et culturelles`.

## Règles implémentées

- `groupe et échelon` : Groupe 1 à 9 et échelon 1 à 12 des emplois non artistiques (par exemple 5.3).
- `salaire minimum conventionnel` : minimum brut à temps plein de la grille (mensuel), multiplié par `salarié . contrat . temps de travail . quotité` de modele-social ; le montant ne doit donc pas être proratisé une seconde fois.
- `groupe et échelon hors grille` signale une classification absente de la grille (minimum à 0).

## Limites

- Seuls les minima de salaire sont modélisés : primes, majorations, maintien de salaire, indemnités de rupture, santé et prévoyance ne le sont pas.
- Le SMIC reste un plancher à appliquer par le moteur de paie lorsque le minimum conventionnel lui est inférieur.

## Sources

- Accord du 1er juillet 2026 relatif aux salaires pour l'année 2026, article 1.2 (salaires mensuels bruts minima des emplois non artistiques, groupes 1 à 9, échelons 1 à 12), minima applicables au 1er août 2026, étendu par arrêté du 7 septembre 2026 (JORF du 19 septembre 2026). Les minima des artistes (articles 1.1.1 à 1.1.4 : cachets, services, mensuels) ne sont pas modélisés.
- https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054981887
- Convention collective nationale des entreprises artistiques et culturelles (Syndeac), conteneur KALICONT000005635964.
