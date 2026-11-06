# Industrie des tuiles et briques — IDCC 1170

Le fichier [2024.1](1170-tuiles-briques.2024.1.publicodes) entre en vigueur le 1er janvier 2024 ; il lie les entreprises non adhérentes aux organisations signataires à partir du 7 novembre 2024. Ouvriers et ETAM : avenant n° 18 du 26 juin 2024. Cadres : avenant n° 53 du 7 juillet 2021, au 1er janvier 2021, le dernier barème des cadres trouvé sur Légifrance au 6 novembre 2026.

La valeur Publicodes est `tuiles et briques` ; les règles sont sous `salarié . convention collective . tuiles et briques`.

## Règles implémentées

- `niveau` : `1.A` à `5.D` pour les ouvriers et ETAM, `cadre 300` à `cadre 652` pour les cadres.
- `rémunération minimale annuelle garantie` : montant annuel à temps plein des ouvriers et ETAM.
- `salaire minimum des cadres` : montant mensuel à temps plein des cadres.
- `salaire minimum conventionnel` : douzième de la garantie annuelle, ou minimum des cadres, multiplié par `salarié . contrat . temps de travail . quotité` de modele-social.
- `prime d'ancienneté` : montant mensuel du groupe après 3, 6, 9, 12 et 15 ans, proratisé selon la quotité de travail. L'article 7 de l'accord du 13 février 2004 l'exclut de la garantie annuelle.
- `niveau hors grille` signale une classification absente des barèmes.

## Limites

- **Ouvriers et ETAM, version en retard :** l'avenant n° 19 du 30 avril 2026 à l'accord du 13 février 2004 est étendu par arrêté du 22 septembre 2026 (JORF du 30 septembre 2026), mais le Bulletin officiel 2026/33 qui le contient n'était pas en ligne au 6 novembre 2026. Ses montants et sa date d'effet ne sont donc pas modélisés.
- **Cadres :** l'avenant n° 53 fixe le point à 6,319 € et dit que le minimum est le coefficient multiplié par le point, mais les montants de son tableau dépassent ce produit de 5 à 10 centimes. Le modèle reprend le tableau.
- La garantie s'apprécie sur l'année et comprend les primes soumises à cotisations (fin d'année, vacances) : un contrôle mensuel sur le douzième peut être plus strict que le texte.
- La majoration de 5 % de la garantie pour le travail posté en continu (article G. 16) n'est pas modélisée.
- La prime différentielle des salariés dont la prime d'ancienneté dépassait le barème en 2004 n'est pas modélisée.
- Seuls ces éléments de salaire sont modélisés : indemnités, maintien de salaire, santé et prévoyance ne le sont pas.
- Le SMIC reste un plancher à appliquer par le moteur de paie.

## Sources

- Avenant n° 18 du 26 juin 2024 : https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000050427949 (arrêté du 5 novembre 2024, JORF du 7 novembre 2024).
- Avenant n° 53 du 7 juillet 2021 : https://www.legifrance.gouv.fr/download/pdf/bocc?id=boc_20210042_0000_0014.pdf (arrêté du 10 décembre 2021, JORF du 22 décembre 2021).
- Arrêté du 3 juillet 2024 portant fusion de champs conventionnels (rattachement à l'IDCC 3249) : https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000049892139
- Accord du 13 février 2004 : https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005657492
- Convention collective nationale du 17 février 1982, conteneur KALICONT000005635251.
