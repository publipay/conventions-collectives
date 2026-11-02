# Banque populaire — IDCC 3210

Le fichier [2024.1](3210-banque-populaire.2024.1.publicodes) entre en vigueur le 1er janvier 2024 ; il lie les entreprises non adhérentes aux organisations signataires à partir du 16 mars 2024. Salaires annuels minima de l'article 40 au 1er janvier 2024, par niveau et ancienneté (en années révolues).

La valeur Publicodes est `banque populaire` ; les règles sont sous `salarié . convention collective . banque populaire`.

## Règles implémentées

- `niveau` : Niveau A à K de la classification.
- `ancienneté` : ancienneté dans l'entreprise en années révolues, qui fixe la tranche de la grille.
- `salaire minimum annuel conventionnel` : minimum brut à temps plein de la grille (annuel), multiplié par `salarié . contrat . temps de travail . quotité` de modele-social ; le montant ne doit donc pas être proratisé une seconde fois.
- `niveau hors grille` signale une classification absente de la grille (minimum à 0).

## Limites

- Seuls les minima de salaire sont modélisés : primes, majorations, maintien de salaire, indemnités de rupture, santé et prévoyance ne le sont pas.
- Le SMIC reste un plancher à appliquer par le moteur de paie lorsque le minimum conventionnel lui est inférieur.

## Sources

- Avenant n° 3 du 21 décembre 2023 relatif aux salaires minima conventionnels au 1er janvier 2024 (article 40 de la convention : salaires annuels minima de branche par niveau, hors ancienneté et après 5, 10, 15 et 20 ans), étendu par arrêté du 27 février 2024 (JORF du 16 mars 2024). Les accords de négociation annuelle obligatoire de 2025 et 2026 (non étendus) prévoient des augmentations générales sans modifier l'article 40.
- https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000049259047
- Convention collective de la Banque populaire, conteneur KALICONT000031197865.
