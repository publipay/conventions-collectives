# Acteurs du lien social et familial — IDCC 1261

> La version 2026.9 a été supprimée pendant la bêta, le 2 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.

La version [2026.1](1261-acteurs-lien-social-familial.2026.1.publicodes) applique en 2026 le système de classification et de rémunération entré en vigueur le 1er janvier 2024. La valeur Publicodes est `acteurs du lien social et familial`.

La version 2026.9, applicable au 1er mai 2026, ajoute le régime conventionnel étendu de complémentaire santé : santé à 1,60 % du PMSS (60 % employeur, 40 % salarié). Les ayants droit, options, dispenses et garanties restent contractuels. Le nouveau régime de prévoyance est documenté dans les sources mais n'est pas calculé automatiquement, car ses catégories, ancienneté et assiettes de garanties nécessitent des entrées de contrat.

La révision [2026.10](1261-acteurs-lien-social-familial.2026.10.publicodes), à la même date et aux mêmes taux, change la forme de la complémentaire santé : ses règles `santé . montant` et `santé . taux employeur` remplacent le montant et la part employeur de modele-social (`santé . montant` et `santé . taux employeur`) plutôt que ses parts employeur et salarié : une application peut y saisir le montant ou la part de l'entreprise (`test/health-insurance-scheme.test.ts`).

Le salaire minimum hiérarchique annuel est la somme du salaire socle de **23 000 €**, des `points de pesée` du poste et des `points d'expérience professionnelle`, à **55 €** par point. Il est payé mensuellement par douzième et proratisé par la quotité de travail.

`points de pesée` est la somme des points au-delà du premier niveau des huit critères classants. La détermination détaillée du poste et des points d'ancienneté ou de compétences demeure une décision de paie documentée ; le modèle reçoit leurs totaux déjà établis. Les valeurs négatives sont invalides.

Les règles couvrent le minimum hiérarchique de branche. Elles n'incluent pas les primes, indemnités, avantages ou les modalités de détermination des huit critères. Les références juridiques sont enregistrées dans les métadonnées de la version.

## Financement du paritarisme

La révision 2026.11, à la date d'effet de la version 2026.10, ajoute `financement du paritarisme` : la contribution annuelle des employeurs au fonds d'aide au paritarisme : 0,08 % de la masse salariale brute (article 4.1 du protocole n° 11-05 du 10 novembre 2005, KALITEXT000005677524). Le minimum de 20 € (avenant n° 07-09 du 9 décembre 2009) n'est pas calculé. Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, en provision mensuelle sur le brut du mois ; la régularisation annuelle n'est pas calculée.

## Contribution conventionnelle de formation

Les révisions 2026.12 (version 2026.1) et 2026.13 (version 2026.11), à la date d'effet de chaque version, ajoutent `formation professionnelle conventionnelle` : contribution conventionnelle de formation professionnelle : 1,10 % de la masse salariale brute à partir de 11 salariés, 1,55 % en dessous, pour une contribution totale de 2,1 % avec la contribution légale (avenant n° 05-20 du 10 juillet 2020). Le montant mensuel est une provision sur le brut du mois (KALITEXT000042463667). Lu sur Légifrance le 9 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`, à côté de la contribution légale ; la régularisation annuelle n'est pas calculée.
