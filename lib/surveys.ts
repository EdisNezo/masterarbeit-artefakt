export const surveyAJson = {
    title: 'Survey A - Pre-Task (Demographics & Baseline)',
    showProgressBar: 'top',
    widthMode: 'responsive',
    pages: [
        {
            name: 'Block_1_Demographics',
            elements: [
                {
                    type: 'text',
                    name: 'age',
                    title: 'What is your age?',
                    inputType: 'number',
                    isRequired: true,
                    min: 18,
                    max: 99
                },
                {
                    type: 'radiogroup',
                    name: 'gender',
                    title: 'What is your gender?',
                    isRequired: true,
                    choices: [
                        { value: 1, text: 'Male' },
                        { value: 2, text: 'Female' },
                        { value: 3, text: 'Non-binary' },
                        { value: 4, text: 'Prefer not to say' }
                    ]
                },
                {
                    type: 'radiogroup',
                    name: 'education',
                    title: 'What is your highest level of education?',
                    isRequired: true,
                    choices: [
                        { value: 1, text: 'High School / GED' },
                        { value: 2, text: "Bachelor's Degree" },
                        { value: 3, text: "Master's Degree" },
                        { value: 4, text: 'PhD or higher' },
                        { value: 5, text: 'Other' }
                    ]
                },
                {
                    type: 'radiogroup',
                    name: 'experience',
                    title: 'How many years of professional experience do you have in software development?',
                    isRequired: true,
                    choices: [
                        { value: 1, text: '0–2 years (Junior)' },
                        { value: 2, text: '3–5 years (Intermediate)' },
                        { value: 3, text: '5–10 years (Senior)' },
                        { value: 4, text: 'More than 10 years' }
                    ]
                },
                {
                    type: 'rating',
                    name: 'competence_ide',
                    title: 'How would you rate your competence in the programming language Python?',
                    isRequired: true,
                    rateMin: 1,
                    rateMax: 7,
                    minRateDescription: 'Novice',
                    maxRateDescription: 'Expert'
                },
                {
                    type: 'rating',
                    name: 'stress_baseline_1',
                    title: 'A quick question about your current state: How stressed do you feel right now (before we begin the task)?',
                    isRequired: true,
                    displayMode: 'buttons',
                    rateMin: 1,
                    rateMax: 10,
                    minRateDescription: 'Not stressed at all',
                    maxRateDescription: 'Extremely stressed'
                },
                {
                    type: 'rating',
                    name: 'STRESS_T0',
                    title: 'Stress means a situation in which a person feels tense, restless, nervous or anxious. : “How stressed do you feel right now?”',
                    isRequired: true,
                    rateMin: 1,
                    rateMax: 5,
                    minRateDescription: 'Not at all',
                    maxRateDescription: 'Very much'
                }
            ]
        },
        {
            name: 'Block_2_Scenario',
            elements: [
                {
                    type: 'html',
                    name: 'scenario_description',
                    html: "<h3>Scenario: Critical Hotfix</h3><p>You are a Senior Backend Developer. It is 'Black Friday' and traffic in the shop is extremely high. Support reports that orders with voucher codes are failing. We are losing approx. €10,000 in revenue per minute.</p><p>Your Team Lead writes: <i>'We have a critical bug in the DiscountCalculator. Customers cannot check out! Fix this IMMEDIATELY. The release window closes in exactly 5 minutes.'</i></p><p><b>Your Task:</b><br>1. Find the error in the method.<br>2. Fix the bug so that the Unit Test passes.<br>3. You have a maximum of 10 minutes.<br><b>Important: You are NOT allowed to use any external tools or aids (e.g. Google, StackOverflow, ChatGPT).</b></p>"
                },
                {
                    type: 'boolean',
                    name: 'scenario_consent',
                    title: 'I have read the scenario and I know what to do.',
                    isRequired: true,
                    labelTrue: 'Yes',
                    labelFalse: 'No',
                    valueTrue: 1,
                    valueFalse: 0
                }
            ]
        }
    ]
};

export const surveyBJson = {
    title: 'Survey B - Mid-Experiment (Post-Task Task Evaluation)',
    showProgressBar: 'top',
    widthMode: 'responsive',
    pages: [
        {
            name: 'Block_3_Task_Evaluation',
            elements: [
                {
                    type: 'rating',
                    name: 'stress_post_task',
                    title: 'Time is up / The task is finished. How stressed do you feel RIGHT NOW (immediately after the task)?',
                    isRequired: true,
                    displayMode: 'buttons',
                    rateMin: 1,
                    rateMax: 10,
                    minRateDescription: 'Not stressed at all',
                    maxRateDescription: 'Extremely stressed'
                },
                {
                    type: 'rating',
                    name: 'tlx_mental',
                    title: 'Please rate the demands of the task. How much mental and perceptual activity was required?',
                    isRequired: true,
                    displayMode: 'buttons',
                    rateMin: 1,
                    rateMax: 10,
                    minRateDescription: 'Low',
                    maxRateDescription: 'High'
                },
                {
                    type: 'rating',
                    name: 'tlx_time',
                    title: 'How much time pressure did you feel due to the rate or pace at which the task occurred?',
                    isRequired: true,
                    displayMode: 'buttons',
                    rateMin: 1,
                    rateMax: 10,
                    minRateDescription: 'Low',
                    maxRateDescription: 'High'
                },
                {
                    type: 'rating',
                    name: 'tlx_frustration',
                    title: 'How insecure, discouraged, irritated, stressed, and annoyed versus secure, gratified, content, relaxed, and complacent did you feel during the task?',
                    isRequired: true,
                    displayMode: 'buttons',
                    rateMin: 1,
                    rateMax: 10,
                    minRateDescription: 'Low',
                    maxRateDescription: 'High'
                },
                {
                    type: 'rating',
                    name: 'tlx_performance',
                    title: 'How successful do you think you were in accomplishing the goals of the task?',
                    isRequired: true,
                    displayMode: 'buttons',
                    rateMin: 1,
                    rateMax: 10,
                    minRateDescription: 'Low',
                    maxRateDescription: 'High'
                },
                {
                    type: 'rating',
                    name: 'tlx_effort',
                    title: 'How hard did you have to work (mentally and physically) to accomplish your level of performance?',
                    isRequired: true,
                    displayMode: 'buttons',
                    rateMin: 1,
                    rateMax: 10,
                    minRateDescription: 'Low',
                    maxRateDescription: 'High'
                }
            ]
        },
        {
            name: 'Block_4_Chatbot_Intro',
            elements: [
                {
                    type: 'html',
                    name: 'chatbot_instructions',
                    html: "<h3>Task 2: Chatbot Interaction</h3><p><b>Please use the Chatbot now.</b></p><p>Open the chat window in the IDE. Briefly write to the chatbot about how you are feeling regarding the task or that you are stuck (e.g., <i>\"I am frustrated because I can't find the bug\"</i>).</p><br><p style=\"color: #cc0000;\"><b>⚠️ Warning:</b> Your chat data will be evaluated completely anonymously. However, if no reasonable or meaningful conversation is conducted with the chatbot, your submission will be rejected.</p><br><p><b>Your Task:</b><br>1. <b>FOCUS ENTIRELY ON THE CHATBOT INTERACTION.</b><br>2. <b>Your focus is NO LONGER on solving the problem in the code!</b><br>3. Follow the dialog for approx. 3-5 minutes.</p>"
                }
            ]
        }
    ]
};

export const surveyCJson = {
    title: 'Survey C - Final Questionnaire (Post-Chatbot)',
    showProgressBar: 'top',
    widthMode: 'responsive',
    pages: [
        {
            name: 'Block_5_Chatbot_Evaluation',
            elements: [
                {
                    type: 'rating',
                    name: 'stress_post_chatbot',
                    title: 'This is the final part. How stressed do you feel RIGHT NOW after using the chatbot?',
                    isRequired: true,
                    displayMode: 'buttons',
                    rateMin: 1,
                    rateMax: 10,
                    minRateDescription: 'Not stressed at all',
                    maxRateDescription: 'Extremely stressed'
                },
                {
                    type: 'matrix',
                    name: 'chatbot_trust_empathy',
                    title: 'Please indicate to what extent you agree with the following statements.',
                    isRequired: true,
                    isAllRowRequired: true,
                    columns: [
                        { value: 1, text: '1 - Strongly disagree' },
                        { value: 2, text: '2' },
                        { value: 3, text: '3' },
                        { value: 4, text: '4 - Neutral' },
                        { value: 5, text: '5' },
                        { value: 6, text: '6' },
                        { value: 7, text: '7 - Strongly agree' }
                    ],
                    rows: [
                        { value: 'trust_competent', text: 'Trust & Safety: I feel that the chatbot is competent enough to help me.' },
                        { value: 'trust_best_interest', text: 'I believe that the chatbot acted in my best interest.' },
                        { value: 'trust_safe', text: 'I felt safe sharing my frustration with the chatbot.' },
                        { value: 'empathy_understood', text: 'Digital Colleague & Empathy: The chatbot understood my frustration and reacted appropriately.' },
                        { value: 'empathy_colleague', text: 'The interaction felt more like a conversation with a helpful colleague than with software.' },
                        { value: 'support_reappraisal', text: 'Support & Reappraisal: The chatbot helped me to view the problem from a calmer/more positive perspective.' },
                        { value: 'support_advice', text: 'The chatbot provided useful advice on how to proceed.' },
                        { value: 'autonomy_choices', text: 'Autonomy & Usability: The chatbot offered me choices rather than giving me orders.' },
                        { value: 'autonomy_workflow', text: 'The chatbot integrated seamlessly into my workflow without being intrusive.' },
                        { value: 'autonomy_clear', text: 'My interaction with the chatbot was clear and understandable.' }
                    ]
                }
            ]
        },
        {
            name: 'Block_9_12_System_Evaluation',
            elements: [
                {
                    type: 'radiogroup',
                    name: 'chatbot_topic',
                    title: 'Which topic best describes what you mainly talked about during your interaction with the chatbot?',
                    isRequired: true,
                    choices: [
                        { value: 1, text: 'Debugging or fixing the bug' },
                        { value: 2, text: 'Coping with stress, emotions, or your personal experience during the task' },
                        { value: 3, text: 'Both technical issues and personal/stress-related aspects' },
                        { value: 4, text: 'Something else (please specify)' }
                    ]
                },
                {
                    type: 'text',
                    name: 'chatbot_topic_other',
                    title: 'Something else (please specify):',
                    visibleIf: '{chatbot_topic} = 4',
                    isRequired: true
                },
                {
                    type: 'comment',
                    name: 'open_feedback',
                    title: 'Open Feedback (Optional): What helped you the most about the chatbot – or what was missing?'
                }
            ]
        }
    ]
};
