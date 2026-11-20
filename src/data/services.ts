// Eén bron voor de vier diensten: homepage (kort) en Diensten-pagina (uitgewerkt).
// Teksten goedgekeurd in het tekstdocument. "worksWith" volgt zodra Sakhi de pakketten aanlevert.
import AnomalyVisual from "../components/visuals/AnomalyVisual.astro";
import VarianceVisual from "../components/visuals/VarianceVisual.astro";
import DashboardVisual from "../components/visuals/DashboardVisual.astro";
import ReconVisual from "../components/visuals/ReconVisual.astro";

export const services = [
  {
    id: "ai-tools",
    title: "AI-tools voor finance managers",
    text: "Analyses die je elke maand opnieuw bouwt, draaien vanzelf. De tool markeert afwijkingen en zet ze klaar voor jouw beoordeling.",
    now: "Elke maand bouw je dezelfde analyses opnieuw op. Afwijkingen vind je pas als je er zelf naar zoekt.",
    gone: "Het telkens opnieuw opbouwen van terugkerende analyses en het handmatig speuren naar uitschieters.",
    back: "Een lijst met afwijkingen die al klaarstaat als je begint. Jij beoordeelt wat ertoe doet.",
    caption: "Afwijkingen in inkoopkosten per week",
    Visual: AnomalyVisual,
  },
  {
    id: "business-controlling",
    title: "Business controlling",
    text: "Marges, kostenstructuur en forecast in één model, zonder Excel-bestanden die aan elkaar hangen. De variantieanalyse per kostenplaats staat klaar zodra de periode dicht is.",
    now: "Marges, kosten en forecast staan in losse Excel-bestanden die naar elkaar verwijzen. Eén verschoven kolom en niets klopt meer.",
    gone: "Het koppelen, kopiëren en controleren van bestanden voordat je aan de analyse toekomt.",
    back: "Eén model met marges, kostenstructuur en forecast. De variantieanalyse per kostenplaats staat klaar zodra de periode dicht is.",
    caption: "Afwijking t.o.v. budget per kostenplaats",
    Visual: VarianceVisual,
  },
  {
    id: "dashboards",
    title: "Management dashboards",
    text: "De directie ziet omzet, marge, werkkapitaal en cashflow zonder te wachten op de maandrapportage. Eén versie van de cijfers voor iedereen.",
    now: "De directie wacht op de maandrapportage. Tegen de tijd dat die er ligt, is de maand al lang voorbij.",
    gone: "Het handmatig samenstellen van rapportages en het beantwoorden van losse cijfervragen.",
    back: "Omzet, marge, werkkapitaal en cashflow in één dashboard. Eén versie van de cijfers voor iedereen.",
    caption: "Kerncijfers voor de directie",
    Visual: DashboardVisual,
  },
  {
    id: "afsluiting-reconciliatie",
    title: "Afsluiting en reconciliatie",
    text: "De tool zet bank, subadministratie en grootboek naast elkaar en toont alleen wat niet aansluit. Jij beoordeelt, de tool doet het zoekwerk.",
    now: "De bank, de subadministraties en het grootboek sluit je met de hand aan. Op de tussenrekeningen blijven posten staan die niemand meer kan verklaren.",
    gone: "Het naast elkaar leggen van mutaties en het zoeken naar het verschil.",
    back: "Een lijst met alleen de posten die niet aansluiten. Jij beoordeelt en boekt.",
    caption: "Bank tegen grootboek, september",
    Visual: ReconVisual,
  },
];
