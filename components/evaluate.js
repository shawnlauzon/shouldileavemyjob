export default function (chart, answers, i18n) {
  const COLLABORATION_SOLO = 0
  const COLLABORATION_PARTNER = 1
  const COLLABORATION_SMALL_TEAM = 2
  const COLLABORATION_LARGE_VARIETY = 3

  const INTERACTION_SOLO = 0
  const INTERACTION_ONE_ON_ONE = 1
  const INTERACTION_ONE_ON_MANY = 2

  const KEY_FLOW_INDICATORS = {
    Advisor: ['Success', 'Bitterness'],
    'Classic Builder': ['Satisfaction', 'Frustration'],
    'Express Builder': ['Satisfaction', 'Frustration'],
    Initiator: ['Peace', 'Anger'],
    Evaluator: ['Surprise', 'Disappointment'],
  }

  const keyFlowIndicator = function () {
    return KEY_FLOW_INDICATORS[chart.careerType][0]
  }
  const keyResistenceIndicator = function () {
    return KEY_FLOW_INDICATORS[chart.careerType][1]
  }

  const steps = [
    {
      step: 'resistenceFrequency',
      results: [
        {
          check: (ans) => ans > 7,
          update: function (acc, ans) {
            acc.update(-Math.round(ans ** 1.3) + 3, 'resistenceHigh', {
              indicator: keyResistenceIndicator(),
            })
          },
        },
        {
          check: (ans) => ans > 5 && ans <= 7,
          update: function (acc, ans) {
            acc.update(-ans, 'resistenceHigh', {
              indicator: keyResistenceIndicator(),
            })
          },
        },
        {
          check: (ans) => ans <= 5 && ans >= 4,
          update: function (acc) {
            acc.update(0, 'resistenceMed', {
              indicator: keyResistenceIndicator(),
            })
          },
        },
        {
          check: (ans) => ans < 4,
          update: function (acc, ans) {
            acc.update(10 - ans * 3, 'resistenceLow', {
              indicator: chart.keyIndicators[0],
            })
          },
        },
      ],
    },
    {
      step: 'flowFrequency',
      isVisible: () => true,
      results: [
        {
          check: (ans) => ans > 7,
          update: function (acc, ans) {
            acc.update(Math.round(ans ** 1.3) - 5, 'flowHigh', {
              indicator: keyFlowIndicator(),
            })
          },
        },
        {
          check: (ans) => ans <= 7 && ans >= 4,
          update: function (acc, ans) {
            acc.update(ans - 2, 'flowMed', {
              indicator: keyFlowIndicator(),
            })
          },
        },
        {
          check: (ans) => ans < 4,
          update: function (acc, ans) {
            acc.update(-Math.round((10 - ans) ** 1.3) + 8, 'flowLow', {
              indicator: keyFlowIndicator(),
            })
          },
        },
      ],
    },
    {
      step: 'collaboration',
      isVisible: () => true,
      results: [
        {
          check: (ans) => ans === COLLABORATION_SOLO,
          update: function (acc) {
            switch (this.assimilation) {
              case 'Independent':
                acc.update(10, 'independentSolo')
                break
              default:
                acc.update(-10, 'notIndependentSolo')
                break
            }
          },
        },
        {
          check: (ans) => ans === COLLABORATION_PARTNER,
          update: function (acc) {
            switch (chart.assimilation) {
              case 'Independent':
                acc.update(-2, 'independentNotSolo')
                break
              case 'Collaborative':
                acc.update(10, 'collaborativePartner')
                break
              case 'Synthesizing':
                acc.update(-4, 'multipleSplitPartner')
                break
              default:
                acc.update(-6, 'multipleSplitPartner')
                break
            }
          },
        },
        {
          check: (ans) => ans === COLLABORATION_SMALL_TEAM,
          update: function (acc) {
            switch (chart.assimilation) {
              case 'Independent':
                acc.update(-2, 'independentNotSolo')
                break
              case 'Collaborative':
                acc.update(6, 'collaborativeSmallGroup')
                break
              case 'Synthesizing':
                acc.update(-4, 'multipleSplitSmallGroup')
                break
              default:
                acc.update(-6, 'multipleSplitSmallGroup')
                break
            }

            if (chart.hasPentaRoleStrengths) {
              acc.update(10, 'smallGroupUpperPenta')
            } else if (chart.hasPentaManagedStrengths) {
              acc.update(5, 'smallGroupLowerPenta')
            } else {
              acc.update(-7, 'smallGroupNotPenta')
            }
          },
        },
        {
          check: (ans) => ans === COLLABORATION_LARGE_VARIETY,
          update: function (acc) {
            switch (chart.assimilation) {
              case 'Independent':
                acc.update(2, 'independentNotSolo')
                break
              case 'Collaborative':
                acc.update(2, 'collaborativeVariety')
                break
              default:
                acc.update(10, 'multipleSplitVariety')
                break
            }
          },
        },
      ],
    },
    {
      step: 'interaction',
      isVisible: () => true,
      results: [
        {
          check: (ans) => ans === INTERACTION_SOLO,
          update: function (acc) {
            switch (chart.careerType) {
              case 'Advisor':
                acc.update(-10, 'advisorSolo')
                break
              case 'Evaluator':
                acc.update(-3, 'evaluatorSolo')
                break
              case 'Initiator':
                acc.update(5, 'initiatorSolo')
                break
              default: // Builder
                acc.update(-5, 'builderSolo')
                break
            }
          },
        },
        {
          check: (ans) => ans === INTERACTION_ONE_ON_ONE,
          update: function (acc) {
            switch (chart.careerType) {
              case 'Advisor':
                acc.update(10, 'advisorOneOnOne')
                break
              case 'Evaluator':
                acc.update(-3, 'evaluatorOneOnOne')
                break
              case 'Initiator':
                acc.update(-4, 'initiatorOneOnOne')
                break
              default: // Builder
                acc.update(2, 'builderOneOnOne')
                break
            }
          },
        },
        {
          check: (ans) => ans === INTERACTION_ONE_ON_MANY,
          update: function (acc) {
            switch (chart.careerType) {
              case 'Advisor':
                acc.update(-10, 'advisorGroups')
                break
              case 'Evaluator':
                acc.update(10, 'evaluatorGroups')
                break
              case 'Initator':
                acc.update(5, 'initiatorGroups')
                break
              default: // Builder
                acc.update(5, 'builderGroups')
                break
            }
          },
        },
      ],
    },
    {
      step: 'selfEmployed',
      isVisible: () => true,
      results: [
        {
          check: (ans) => ans === true && chart.hatesBeingManaged,
          update: (acc) => acc.update(10, 'hatesManagedSelfEmployed'),
        },
      ],
    },
    {
      step: 'haveBoss',
      isVisible: () =>
        chart.answerFor('selfEmployed') === false && chart.hatesBeingManaged,
      results: [
        {
          check: (ans) => ans === true && this.hatesBeingManaged,
          update: (acc) => acc.update(-10, 'hatesManagedHasBoss'),
        },
      ],
    },
    {
      step: 'newJob',
      isVisible: () =>
        chart.answerFor('selfEmployed') === false &&
        chart.publicRole.includes('Influencer') === true,
      results: [
        {
          check: (ans) => ans === false,
          update: function (acc, ans) {
            {
              acc.hasJobLinedUp = ans
              return acc
            }
          },
        },
      ],
    },
  ]

  const acc = {
    score: 0,
    messages: [],
    update: function (delta, key, params) {
      this.score += delta
      this.messages.push({ delta, message: i18n.t(key, params) })
      return acc
    },
  }

  steps.reduce((acc, q) => {
    const answer = answers[q.step]
    q.results.reduce((acc, r) => {
      if (r.check(answer)) {
        r.update(acc, answer)
      }
      return acc
    }, acc)
    return acc
  }, acc)

  return { score: acc.score, messages: acc.messages }
}
