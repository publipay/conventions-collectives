# Enseignement privé indépendant — IDCC 2691

> La version 2026.1 a été supprimée pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.

Le fichier 2026.1 entre en vigueur le 1er mars 2026. Minima annuels des annexes 1-A, 1-B et 1-C de l'avenant n° 69 au 1er mars 2026 ; les annexes 1-D et 1-E ne sont pas modélisées.

La valeur Publicodes est `enseignement privé indépendant` ; les règles sont sous `salarié . convention collective . enseignement privé indépendant`.

## Règles implémentées

- `catégorie et échelon` : Personnel administratif et de service ou d'encadrement pédagogique : E1 à C3 et échelon A, B ou C (par exemple T2.B) ; personnel enseignant : « enseignant 1.A » à « enseignant 10.C » (niveau 1 à 10 de l'annexe 1-C).
- `salaire minimum annuel conventionnel` : minimum brut à temps plein de la grille (annuel), multiplié par `salarié . contrat . temps de travail . quotité` de modele-social ; le montant ne doit donc pas être proratisé une seconde fois.
- `catégorie et échelon hors grille` signale une classification absente de la grille (minimum à 0).

## Limites

- Seuls les minima de salaire sont modélisés : primes, majorations, maintien de salaire, indemnités de rupture, santé et prévoyance ne le sont pas.
- Le SMIC reste un plancher à appliquer par le moteur de paie lorsque le minimum conventionnel lui est inférieur.

## Sources

- Avenant n° 69 du 13 juin 2025 relatif à la négociation annuelle obligatoire (revalorisation de 1,8 % des grilles), annexes 1-A (personnel administratif et de service), 1-B (encadrement pédagogique, valeurs identiques) et 1-C (personnel enseignant) : minima annuels bruts par échelon A, B et C, les montants mensuels étant indicatifs ; article 3 : entrée en vigueur le premier jour du mois suivant la publication de l'arrêté d'extension, arrêté du 6 février 2026 (JORF du 12 février 2026), soit le 1er mars 2026. Les annexes 1-D (enseignants des cycles diplômants avec obligation de recherche) et 1-E (enseignement à distance) ne sont pas modélisées.
- https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000052531975
- Convention collective nationale de l'enseignement privé indépendant du 27 novembre 2007, conteneur KALICONT000019593660.

## Financement du paritarisme

La révision 2026.2, à la date d'effet de la version 2026.1, ajoute `financement du paritarisme` : contribution des entreprises au financement du paritarisme : 0,07 % de la masse salariale (article 2.3 de la convention, rédigé par l'avenant n° 67 du 8 juillet 2025), gérée par l'APEPI. Le montant mensuel est une provision : 0,07 % du brut du mois (KALITEXT000053504343). Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, en provision mensuelle ; la régularisation annuelle n'est pas calculée.
