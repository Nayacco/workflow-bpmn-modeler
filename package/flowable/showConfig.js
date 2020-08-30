export default {
  'bpmn:EndEvent': {},
  'bpmn:StartEvent': {
    initiator: true,
    formKey: true,
    executionListener: true
  },
  'bpmn:UserTask': {
    userType: true,
    assignee: true,
    candidateUsers: true,
    candidateGroups: true,
    executionListener: true,
    async: true,
    priority: true,
    formKey: true,
    skipExpression: true,
    dueDate: true
  },
  'bpmn:ServiceTask': {
    executionListener: true,
    async: true,
    skipExpression: true,
    isForCompensation: true,
    triggerable: true,
    class: true
  },
  'bpmn:ScriptTask': {
    executionListener: true,
    async: true,
    isForCompensation: true,
    autoStoreVariables: true
  },
  'bpmn:ManualTask': {
    executionListener: true,
    async: true,
    isForCompensation: true
  },
  'bpmn:ReceiveTask': {
    executionListener: true,
    async: true,
    isForCompensation: true
  },
  'bpmn:SendTask': {
    executionListener: true,
    async: true,
    isForCompensation: true
  },
  'bpmn:BusinessRuleTask': {
    executionListener: true,
    async: true,
    isForCompensation: true,
    ruleVariablesInput: true,
    rules: true,
    resultVariable: true,
    exclude: true
  }
}
