# ÉCLAT — IDCC 1518

> La version 2026.1 a été supprimée pendant la bêta, le 2 novembre 2026 : aucune période à partir du 1er janvier 2026 ne la choisissait plus. Les passages qui la citent retracent l’historique des règles reprises par les versions suivantes.
>
> Les versions 2026.2 et 2026.3 ont été supprimées pendant la bêta, le 13 novembre 2026 : aucune période à partir du 1er janvier 2026 ne les choisissait plus. Les passages qui les citent retracent l’historique des règles reprises par les versions suivantes.

Le modèle `1518-eclat` expose la version `2026.2` sous l'espace de noms
`salarié . convention collective . éclat`.

## Périmètre salarial

La version `2026.1` reprend l'avenant n° 208 du 23 juin 2025, étendu par arrêté
du 9 octobre 2025 : valeur V1 de 6,81 €, valeur V2 de 7,23 €, formule de
rémunération par coefficient et groupe A à J, points de coordination du groupe
C et points d'ancienneté. Les minima sont mensuels et proratisés une seule fois
par la quotité de travail.

La version `2026.2` conserve cette grille et ajoute l'avenant n° 209 du
9 juillet 2025, étendu par arrêté du 26 mars 2026 (JORF du 3 avril 2026),
d'application au 1er janvier 2026. Elle modélise les deux contributions
calculables sur l'assiette de cotisations :

- contribution totale de formation professionnelle : **2,10 %** des rémunérations ;
- contribution conventionnelle dédiée à la formation des dirigeants bénévoles :
  **0,05 %** des rémunérations.

Les deux taux sont exposés en montants mensuels et utilisent l'assiette
`salarié . cotisations . assiette` de `modele-social`. Le 2,10 % inclut la
contribution légale et la contribution conventionnelle ; il ne faut donc pas
additionner le taux légal une seconde fois.

## Audit du référentiel de paie

Les sources officielles consultées couvrent la grille salariale et les
contributions de formation. Elles ne fournissent pas, dans les textes retenus,
de règle générique et calculable propre à ÉCLAT sur les bases de cotisations
hors assiette générale, plafonds ou tranches, forfaits, avantages en nature,
frais de santé, prévoyance, AT/MP ou exonérations. Ces rubriques restent
héritées de `modele-social` et aucun taux de branche n'est inventé.

Les dispositifs de collecte, de mutualisation, de CPF-CDD, d'apprentissage et
la répartition de l'enveloppe entre structures nécessitent des paramètres
juridiques ou déclaratifs supplémentaires ; ils restent documentés mais ne
sont pas calculés par ce modèle. Les primes et indemnités de la convention
restent également hors périmètre.

## Sources officielles

- Avenant n° 208 du 23 juin 2025 relatif à la négociation salariale annuelle obligatoire, KALITEXT000052447622.
- Avenant n° 209 du 9 juillet 2025 relatif à la formation professionnelle et à l'apprentissage, notamment articles 5 et 12, KALIARTI000052447643 et KALIARTI000052447694.
- Arrêté du 26 mars 2026 portant extension de l'avenant n° 209, JORF du 3 avril 2026.
- Convention collective nationale ÉCLAT du 28 juin 1988, IDCC 1518.

## Financement du paritarisme

La révision 2026.3, à la date d'effet de la version 2026.2, ajoute `financement du paritarisme` : la cotisation annuelle des employeurs au fonds pour le fonctionnement et le développement du paritarisme : 0,1 % du revenu d'activité retenu pour les cotisations sociales, dès le premier centime (articles 1.8.2 et 1.8.3 de la convention, rédigés par l'avenant n° 197 du 11 mai 2023, KALITEXT000048052461, étendu par arrêté du 10 octobre 2024). Elle est distincte de la contribution conventionnelle de formation déjà calculée. Lu sur Légifrance le 8 novembre 2026. Elle s'ajoute à `salarié . cotisations . employeur`. Le montant mensuel est une provision sur le brut du mois ; la régularisation annuelle n'est pas calculée.

## Contribution conventionnelle de formation

La révision 2026.4, à la date d'effet de la version 2026.3, sort la part conventionnelle de la contribution de formation professionnelle (taux global de 2,10 % de l'assiette des cotisations, diminué de la contribution légale) de la contribution légale : `formation professionnelle conventionnelle` s'ajoute à `salarié . cotisations . employeur`, et `salarié . cotisations . formation professionnelle` redevient la seule contribution légale. Le montant total est inchangé.
