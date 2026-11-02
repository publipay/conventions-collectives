# Industries et commerce de la récupération — IDCC 637

Le fichier [2026.1](0637-industries-commerce-recuperation.2026.1.publicodes) entre en vigueur le 1er janvier 2026 ; il lie les entreprises non adhérentes aux organisations signataires à partir du 17 janvier 2026. Barème des salaires minima conventionnels au 1er janvier 2026.

La valeur Publicodes est `récupération` ; les règles sont sous `salarié . convention collective . récupération`.

## Règles implémentées

- `niveau` : Niveau I à VII et échelon A, B ou C (par exemple IV.B).
- `salaire minimum conventionnel` : minimum brut à temps plein de la grille (mensuel), multiplié par `salarié . contrat . temps de travail . quotité` de modele-social ; le montant ne doit donc pas être proratisé une seconde fois.
- `niveau hors grille` signale une classification absente de la grille (minimum à 0).

## Limites

- Seuls les minima de salaire sont modélisés : primes, majorations, maintien de salaire, indemnités de rupture, santé et prévoyance ne le sont pas.
- Le SMIC reste un plancher à appliquer par le moteur de paie lorsque le minimum conventionnel lui est inférieur.

## Sources

- Accord du 3 octobre 2025 relatif aux salaires au 1er janvier 2026, annexe 1 (barème des salaires minima conventionnels, base 151,67 heures, niveaux I à VII, colonnes A à C), étendu par arrêté du 13 janvier 2026 (JORF du 17 janvier 2026). Tableau lu sur Légifrance le 2 novembre 2026 (la colonne D est vide).
- https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000053497305
- Convention collective nationale des industries et du commerce de la récupération du 6 décembre 1971, conteneur KALICONT000005635466.
