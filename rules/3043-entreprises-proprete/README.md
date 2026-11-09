# Entreprises de propreté et services associés — IDCC 3043

> Les versions 2026.1 et 2026.2 ont été supprimées pendant la bêta, le 2 novembre 2026 : aucune période à partir du 1er janvier 2026 ne les choisissait plus. Les passages qui les citent retracent l’historique des règles reprises par les versions suivantes.

Ce répertoire contient le modèle Publicodes de la convention collective nationale des entreprises de propreté et services associés du 26 juillet 2011 (IDCC 3043).

## Version `2026.1`

La version est applicable à partir du **1er avril 2026**. Elle met en œuvre l'avenant n° 27 du 18 décembre 2025 à l'accord du 25 juin 2002 sur les classifications et salaires. Les références juridiques complètes figurent dans les métadonnées du fichier `.publicodes`.

### Classification et rémunération minimale hiérarchique

La règle `niveau` accepte les codes suivants :

- agents de service : `ASP-A`, `ASP-B`, `ASC-A`, `ASC-B`, `ASCS-A`, `ASCS-B` ;
- agents qualifiés : `AQS1-A` à `AQS3-B` ;
- agents très qualifiés : `ATQS1-A` à `ATQS3-B` ;
- chefs d'équipe : `CE1` à `CE3` ;
- maîtrise d'exploitation : `MP1` à `MP5` ;
- employés administratifs : `EA1` à `EA4` ;
- maîtrise administrative : `MA1` à `MA3` ;
- cadres : `CA1` à `CA6`.

Les catégories rémunérées à l'heure sont converties sur **151,67 heures mensuelles**. Les minima des cadres sont mensuels. La règle `salaire minimum conventionnel` applique ensuite une seule proratisation par la quotité de travail. Une valeur non présente dans la grille fait valoir `niveau hors grille`.

La colonne B des familles AS, AQS et ATQS est réservée aux salariés remplissant les conditions conventionnelles liées aux activités de propreté et prestations associées ; l'application appelante doit déterminer cette colonne à partir de la situation de travail.

### Règles de rémunération complémentaires modélisées

- `prime d'expérience` : 2 % à 4 ans, puis 3 %, 4 %, 5 %, 6 % et 7 % aux seuils de 7, 10, 15, 20 et 25 ans d'expérience professionnelle reconnue ;
- travail de nuit : majoration de 20 % des heures régulières et de 100 % des heures exceptionnelles ; repos compensateur de 2 % pour un salarié de nuit ;
- dimanche : majoration de 25 % si le travail est prévu et de 100 % s'il est exceptionnel, à compter du 1er juillet 2026 ;
- jours fériés : 50 % si le travail est prévu, 100 % s'il est exceptionnel, et 100 % les 1er janvier, 1er mai, 14 juillet et 25 décembre ;
- indemnité de transport : formule fondée sur sept fois le minimum garanti, fournie explicitement à la règle par l'application appelante.

Les compteurs de temps et l'éligibilité aux indemnités sont des entrées déclaratives : le package ne connaît pas le planning, les déplacements, les accords d'entreprise plus favorables ni les situations de non-cumul.

## Périmètre non modélisé dans cette version

La convention contient d'autres dispositions qui demandent des données ou une décision de conception de paie absentes de ce package : la prime annuelle et ses règles de présence/proratisation, le paiement des jours fériés non travaillés, les heures supplémentaires, les régimes frais de santé et prévoyance, ainsi que le traitement des avantages plus favorables. Elles ne doivent pas être déduites ou appliquées automatiquement à partir de ce modèle.

## Sources

- [Convention collective IDCC 3043](https://www.legifrance.gouv.fr/conv_coll/id/KALICONT000027172335)
- [Avenant n° 27 du 18 décembre 2025 — grille salariale](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000053748401)
- [Avenant n° 21 du 5 mars 2025 — prime d'expérience](https://www.legifrance.gouv.fr/conv_coll/article/KALIARTI000051694378)
- [Avenant n° 23 du 18 décembre 2025 — dimanche et jours fériés](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000053748405)
- [Accord relatif à l'indemnité de transport](https://www.legifrance.gouv.fr/conv_coll/id/KALITEXT000005665494)

## Maintien de salaire

La révision 2026.2 ajoute le maintien de salaire conventionnel (article 4.9.1 a) sous `maintien de salaire`, lu sur Légifrance le 24 octobre 2026 : les durées, taux, carences et modalités sont dans les sources de la version et dans `test/salary-maintenance.test.ts`. L’interface est décrite dans le README du package.

La révision 2026.3 ajoute les indemnités de licenciement (article 4.11.3) et de départ ou de mise à la retraite (article 4.12), sous `indemnité de rupture`, lus sur Légifrance le 28 octobre 2026 : les barèmes, seuils d'ancienneté et plafonds sont dans les sources de la version et dans `test/termination-indemnity.test.ts`, en mois de salaire de référence. Aucun montant propre pour la rupture conventionnelle.

## Financement du paritarisme

La révision 2026.4, à la date d'effet de la version 2026.3, ajoute `financement du paritarisme` : contribution patronale au développement du dialogue social de branche : 0,01 % de la masse salariale brute soumise à cotisations (article 3.2 de l'annexe V, accord du 19 septembre 2018). Le montant mensuel est une provision : 0,01 % du brut du mois (KALITEXT000038184099). Lu sur Légifrance le 9 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, en provision mensuelle ; la régularisation annuelle n'est pas calculée.

## Contribution conventionnelle de formation

La révision 2026.5, à la date d'effet de la version 2026.4, ajoute `formation professionnelle conventionnelle` : contribution conventionnelle de branche pour le développement de la formation des entreprises de 11 salariés et plus : 0,5 % de la masse salariale brute (article 5.1.3 de l'accord formation, avenant n° 22 du 13 mars 2025). Le montant mensuel est une provision : 0,5 % du brut du mois (KALITEXT000051695012). Lu sur Légifrance le 9 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, à côté de la contribution légale ; la régularisation annuelle n'est pas calculée.
