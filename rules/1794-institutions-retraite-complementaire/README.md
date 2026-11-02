# Personnel des institutions de retraite complémentaire — IDCC 1794

Le fichier [2025.1](1794-institutions-retraite-complementaire.2025.1.publicodes) entre en vigueur le 1er janvier 2025 ; il lie les entreprises non adhérentes aux organisations signataires à partir du 31 mai 2025. Rémunération mensuelle minimale garantie 2025 par classe.

La valeur Publicodes est `institutions de retraite complémentaire` ; les règles sont sous `salarié . convention collective . institutions de retraite complémentaire`.

## Règles implémentées

- `classe` : Classe de la grille (1A à 8D ; pas de 7A, et les classes 8A et 8B n'ont pas de minimum publié).
- `salaire minimum conventionnel` : minimum brut à temps plein de la grille (mensuel), multiplié par `salarié . contrat . temps de travail . quotité` de modele-social ; le montant ne doit donc pas être proratisé une seconde fois.
- `classe hors grille` signale une classification absente de la grille (minimum à 0).

## Limites

- Seuls les minima de salaire sont modélisés : primes, majorations, maintien de salaire, indemnités de rupture, santé et prévoyance ne le sont pas.
- Le SMIC reste un plancher à appliquer par le moteur de paie lorsque le minimum conventionnel lui est inférieur.

## Sources

- Accord du 21 mars 2025 relatif à la rémunération mensuelle minimale garantie pour l'année 2025 (RMMG par classe), applicable au 1er janvier 2025, étendu par arrêté du 27 mai 2025 (JORF du 31 mai 2025) ; la clause de garantie de l'article 9.1 de l'annexe IV est suspendue pour 2025. Aucun accord de salaires postérieur n'est publié sur Légifrance au 2 novembre 2026.
- https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000051787131
- Convention collective nationale de travail du personnel des institutions de retraite complémentaire, conteneur KALICONT000005635698.
