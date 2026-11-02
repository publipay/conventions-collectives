# Couture parisienne et autres métiers de la mode — IDCC 303

Le fichier [2024.1](0303-couture-parisienne.2024.1.publicodes) entre en vigueur le 1er janvier 2024 ; il lie les entreprises non adhérentes aux organisations signataires à partir du 20 juin 2024. Rémunérations minimales annuelles garanties de l'annexe 16 (avenant n° 18 du 2 avril 2024).

La valeur Publicodes est `couture parisienne` ; les règles sont sous `salarié . convention collective . couture parisienne`.

## Règles implémentées

- `niveau` : Groupe 1 à 9 et niveau A, B ou C de l'annexe 16 (par exemple 3.B) ; les groupes 7 à 9 n'ont que les niveaux B et C.
- `salaire minimum annuel conventionnel` : minimum brut à temps plein de la grille (annuel), multiplié par `salarié . contrat . temps de travail . quotité` de modele-social ; le montant ne doit donc pas être proratisé une seconde fois.
- `niveau hors grille` signale une classification absente de la grille (minimum à 0).

## Limites

- Seuls les minima de salaire sont modélisés : primes, majorations, maintien de salaire, indemnités de rupture, santé et prévoyance ne le sont pas.
- Le SMIC reste un plancher à appliquer par le moteur de paie lorsque le minimum conventionnel lui est inférieur.

## Sources

- Avenant n° 18 du 2 avril 2024 à l'accord du 25 janvier 2002 relatif aux rémunérations minimales annuelles garanties (annexe 16 : groupes 1 à 9, niveaux A à C, base 35 heures par semaine et 1 600 heures par an), applicable à compter du 1er janvier 2024 (article 2), étendu par arrêté du 14 juin 2024 (JORF du 20 juin 2024). Tableau lu sur Légifrance le 2 novembre 2026 : les groupes 7 à 9 n'ont pas de niveau A.
- https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000049756101
- Convention collective nationale de la couture parisienne et des autres métiers de la mode, conteneur KALICONT000005635552.
