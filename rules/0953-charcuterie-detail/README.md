# Charcuterie de détail — IDCC 953

> La version 2026.1 a été supprimée pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.

Le fichier 2026.1 entre en vigueur le 1er janvier 2026 ; il lie les entreprises non adhérentes aux organisations signataires à partir du 23 juillet 2026. Taux horaires de l'avenant n° 64 (de 12,27 € à 20,43 €), convertis en minima mensuels.

La valeur Publicodes est `charcuterie de détail` ; les règles sont sous `salarié . convention collective . charcuterie de détail`.

## Règles implémentées

- `coefficient` : Coefficient de 150 à 330 de la grille.
- `salaire minimum conventionnel` : minimum brut à temps plein de la grille (mensuel), multiplié par `salarié . contrat . temps de travail . quotité` de modele-social ; le montant ne doit donc pas être proratisé une seconde fois.
- `coefficient hors grille` signale une classification absente de la grille (minimum à 0).

## Limites

- Seuls les minima de salaire sont modélisés : primes, majorations, maintien de salaire, indemnités de rupture, santé et prévoyance ne le sont pas.
- Le SMIC reste un plancher à appliquer par le moteur de paie lorsque le minimum conventionnel lui est inférieur.

## Sources

- Avenant n° 64 du 15 janvier 2026 relatif aux salaires au 1er janvier 2026, article 1er (salaires horaires bruts des coefficients 150 à 330), étendu par arrêté du 17 juillet 2026 (JORF du 23 juillet 2026) sous réserve du SMIC. Les taux horaires sont convertis en minima mensuels pour 151,67 heures, arrondis au centime.
- https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000054553974
- Convention collective nationale de la charcuterie de détail du 1er décembre 1977, conteneur KALICONT000005635375.

## Financement du paritarisme

La révision 2026.2, à la date d'effet de la version 2026.1, ajoute `financement du paritarisme` : contribution des employeurs au financement du paritarisme et du dialogue social : 0,45 % des revenus d'activité soumis à cotisations, collectée par l'Urssaf (article 38.4 de la convention) (KALITEXT000017842201). Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, en provision mensuelle ; la régularisation annuelle n'est pas calculée.
