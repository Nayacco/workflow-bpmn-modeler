export default {
  'bpmn:EndEvent': {},
  'bpmn:StartEvent': {
    initiator: true,
    formKey: true
  },
  'bpmn:UserTask': {
    userType: true,
    assignee: true,
    candidateUsers: true,
    candidateGroups: true,
    async: true,
    priority: true,
    formKey: true,
    skipExpression: true,
    dueDate: true
  },
  'bpmn:ServiceTask': {
    async: true,
    skipExpression: true,
    isForCompensation: true,
    triggerable: true,
    class: true
  },
  'bpmn:ScriptTask': {
    async: true,
    isForCompensation: true,
    autoStoreVariables: true
  },
  'bpmn:ManualTask': {
    async: true,
    isForCompensation: true
  },
  'bpmn:ReceiveTask': {
    async: true,
    isForCompensation: true
  },
  'bpmn:SendTask': {
    async: true,
    isForCompensation: true
  },
  'bpmn:BusinessRuleTask': {
    async: true,
    isForCompensation: true,
    ruleVariablesInput: true,
    rules: true,
    resultVariable: true,
    exclude: true
  }
}
