import React from 'react';

import AroundTheWorld from './AroundTheWorld';
import BarChartByYear from './BarChartByYear';
import Landmarks from './Landmarks';
import NamedCorpse from './NamedCorpse';
import Overview from './Overview';
import SVGContainer from './SVGContainer';
import TreemapByCountry from './TreemapByCountry';

const DEAD_ON_EVEREST = '/dead-on-everest';

const stories = [{
    component: Overview,
    container: null,
    path: `${DEAD_ON_EVEREST}/intro`,
  }, {
    component: BarChartByYear,
    container: SVGContainer,
    highlights: [{
      id: 'year1922',
      text: 'Records of deaths in attempts to climb Mount Everest start in 1922 with the deaths of seven of the hired Tibetan and Nepalese porters on a Britsh expedition, the first recorded expedition with the aim of reaching the summit of the mountain.',
    }, {
      id: 'year1924',
      text: 'In 1924, the British expedition returned; George Mallory and Andrew Irvine died in a summit attempt. Mallory\'s body was later found on the N.E. ridge, a position that is theoretically compatible with death from a fall after summiting the mountain.',
    }, {
      id: 'year1934',
      text: 'British eccentric Maurice Wilson died on Everest in 1934 after sneaking into Tibet to make his attempt. He was an inexperienced climber who made no attempt to learn the necessary skills or even obtain required equipment, such as crampons for walking on glacier ice.',
    }, {
      id: 'year1953',
      text: 'In 1953, Edmund Hillary and Tenzing Norgay became the first climbers to reach the summit of Mount Everest. They descended safely to great celebration, including a knighthood for Hillary and the George Medal for Norgay.',
    }, {
      id: 'year1996',
      text: 'The disastrous 1996 climbing season on Mount Everest was recorded most famously in Jon Krakauer\'s book Into Thin Air.',
    }, {
      id: 'year2006',
      text: '2006 yielded both the controversial death of solo British climber David Sharp, passed by many other climbers ascending to and descending from the summit as he slowly died in the Green Boots cave, and the heroic rescue of Lincoln Hall, who against all odds survived a bivouac in the Death Zone and was discovered the next day by a four-person team led by Daniel Mazur of the U.S.; the team abandoned their own summit attempt and organized a rescue team of about a dozen Sherpas to help Hall descend.',
    }, {
      id: 'year2015',
      text: 'The earthquake in Nepal in April 2015 caused an avalanche at Everest Base Camp, making 2015 the deadliest year to date on the mountain.',
    }],
    path: `${DEAD_ON_EVEREST}/by-year`,
  }, {
    component: Landmarks,
    container: null,
    path: `${DEAD_ON_EVEREST}/landmarks`,
  }, {
    component: () => (
      <NamedCorpse corpseName="The German Woman"
        name="Hannelore Schmatz"
        text="Schmatz died in 1979 during her descent after a successful summitting of Everest via the Southern route. For many years her corpse haunted Camp IV, and two members of a Nepalese police expedition in 1984 fell to their own deaths trying to remove it from sight."
      />
    ),
    container: null,
    path: `${DEAD_ON_EVEREST}/the-german-woman`,
  }, {
    component: () => (
      <NamedCorpse corpseName="Green Boots"
        name="Tsewang Paljor (?)"
        text="Green Boots was a landmark on the main Northwest ridge route to the summit of Everest, curled under a limestone overhang. The body is believed to be that of Tsewang Paljor, one of the three Indian climbers who died in the blizzard disaster of May 10-11, 1996. As of 2014, the corpse is now gone."
      />
    ),
    container: null,
    path: `${DEAD_ON_EVEREST}/green-boots`,
  }, {
    component: () => (
      <NamedCorpse corpseName="Sleeping Beauty"
        name="Francys Arsentiev"
        text="Francys Arsentiev became the first American woman to summit Everest without the aid of supplemental oxygen in 1998, but in the descent with her husband Sergei, she was separated from him. Both died over the course of the following day: Francys from exposure and Sergei from a fall while trying to rescue his wife. In 2007, Ian Woodall (one of those who found Francys dead in 1998) led a successful expedition to remove her body from view."
      />
    ),
    container: null,
    path: `${DEAD_ON_EVEREST}/sleeping-beauty`,
  }, {
    component: AroundTheWorld,
    container: null,
    path: `${DEAD_ON_EVEREST}/countries-intro`,
  }, {
    component: TreemapByCountry,
    container: SVGContainer,
    highlights: [{
      id: 'Nepal',
      text: '🇳🇵 The nation suffering the largest number of deaths on Everest is Nepal, with a total of 111 dead, the majority of them Sherpa hired in the service of other expeditions.',
    }, {
      id: 'India',
      position: 'default',
      text: '🇮🇳 India ranks 2nd in deaths on Everest, including three climbers who died in the 1996 disaster after becoming the first Indians to reach the summit.',
    }, {
      id: 'Japan',
      position: 'default',
      text: '🇯🇵 Japan ranks 3rd in deaths on Everest, with a total of 19 dead, spanning the years 1970 to 2015.',
    }, {
      id: 'United Kingdom',
      position: 'default',
      text: '🇬🇧 Unsurprisingly given its long history with Everest, the United Kingdom ranks high in the ranks of death totals on the moutain, with 18 deaths spanning 1922 to 2010.',
    }, {
      id: 'United States',
      position: 'default',
      text: '🇺🇸 The United States comes in fifth in total deaths on Everest and accounts for 5 of the nearly 20 dead in the 2015 Base Camp avalanche.',
    }],
    margins: {
      top: 40,
      right: 5,
      bottom: 5,
      left: 5,
    },
    path: `${DEAD_ON_EVEREST}/by-country`,
  }];

export default stories;

