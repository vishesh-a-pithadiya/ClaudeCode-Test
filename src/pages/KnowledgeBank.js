import React, { useState } from 'react';
import { useNavigate as useRouterNavigate } from 'react-router-dom';
import './KnowledgeBank.css';

// Decision tree: each node has a question, options, and either children nodes or results
const DECISION_TREE = {
  id: 'root',
  question: 'What type of issue are you experiencing?',
  options: [
    {
      label: 'Hardware / Circuit Issue',
      icon: '🔧',
      next: {
        id: 'hw',
        question: 'What area is the issue related to?',
        options: [
          {
            label: 'Power Supply',
            icon: '⚡',
            next: {
              id: 'hw-power',
              question: 'What kind of power issue?',
              options: [
                {
                  label: 'Output voltage incorrect',
                  next: {
                    id: 'hw-power-voltage',
                    question: 'Is the output voltage too high or too low?',
                    options: [
                      { label: 'Too high', results: [
                        { title: 'Check feedback resistor divider values', url: 'https://e2e.ti.com/search?q=output+voltage+too+high+power+supply' },
                        { title: 'Verify reference voltage pin connections', url: 'https://e2e.ti.com/search?q=reference+voltage+regulator' },
                        { title: 'TI Power Stage Designer Tool', url: 'https://www.ti.com/tool/POWER-STAGE-DESIGNER' },
                      ]},
                      { label: 'Too low / drops under load', results: [
                        { title: 'Check load current vs. regulator rating', url: 'https://e2e.ti.com/search?q=voltage+drop+under+load' },
                        { title: 'Verify input capacitor and trace layout', url: 'https://e2e.ti.com/search?q=input+capacitor+layout+power' },
                        { title: 'TI WEBENCH Power Designer', url: 'https://www.ti.com/design-resources/design-tools-simulation/webench-power-designer.html' },
                      ]},
                    ],
                  },
                },
                {
                  label: 'Excessive noise / ripple',
                  results: [
                    { title: 'Capacitor selection and placement guide', url: 'https://e2e.ti.com/search?q=output+ripple+noise+reduction' },
                    { title: 'Layout tips for switching regulators', url: 'https://e2e.ti.com/search?q=switching+regulator+layout+noise' },
                    { title: 'LDO vs switching regulator noise comparison', url: 'https://e2e.ti.com/search?q=LDO+vs+switching+noise' },
                  ],
                },
                {
                  label: 'Device overheating',
                  results: [
                    { title: 'Thermal design considerations', url: 'https://e2e.ti.com/search?q=thermal+design+regulator+overheating' },
                    { title: 'Power dissipation calculations', url: 'https://e2e.ti.com/search?q=power+dissipation+calculation' },
                    { title: 'TI Thermal Design Guide', url: 'https://www.ti.com/lit/an/slva462/slva462.pdf' },
                  ],
                },
                {
                  label: 'Device not starting up',
                  results: [
                    { title: 'Enable pin and UVLO troubleshooting', url: 'https://e2e.ti.com/search?q=regulator+not+starting+enable+UVLO' },
                    { title: 'Check input voltage range requirements', url: 'https://e2e.ti.com/search?q=input+voltage+range+startup' },
                    { title: 'Soft start and inrush current', url: 'https://e2e.ti.com/search?q=soft+start+inrush+current' },
                  ],
                },
              ],
            },
          },
          {
            label: 'Analog / Signal Chain',
            icon: '📈',
            next: {
              id: 'hw-analog',
              question: 'What type of analog issue?',
              options: [
                {
                  label: 'Op-amp output clipping or saturating',
                  results: [
                    { title: 'Rail-to-rail output swing specifications', url: 'https://e2e.ti.com/search?q=op+amp+output+clipping+saturation' },
                    { title: 'Supply voltage vs. output range', url: 'https://e2e.ti.com/search?q=op+amp+supply+voltage+output+range' },
                    { title: 'Op-amp selection guide', url: 'https://www.ti.com/amplifier-circuit/op-amps/overview.html' },
                  ],
                },
                {
                  label: 'ADC readings inaccurate',
                  results: [
                    { title: 'ADC reference voltage and grounding', url: 'https://e2e.ti.com/search?q=ADC+inaccurate+readings+reference' },
                    { title: 'Input impedance and source impedance matching', url: 'https://e2e.ti.com/search?q=ADC+input+impedance+matching' },
                    { title: 'ADC layout and decoupling best practices', url: 'https://e2e.ti.com/search?q=ADC+layout+decoupling' },
                  ],
                },
                {
                  label: 'Excessive noise in signal',
                  results: [
                    { title: 'Filtering techniques for analog signals', url: 'https://e2e.ti.com/search?q=analog+signal+noise+filtering' },
                    { title: 'Grounding and shielding best practices', url: 'https://e2e.ti.com/search?q=grounding+shielding+noise+reduction' },
                    { title: 'TI Precision Labs - Noise', url: 'https://www.ti.com/video/series/precision-labs/ti-precision-labs-op-amps.html' },
                  ],
                },
                {
                  label: 'DAC output not as expected',
                  results: [
                    { title: 'DAC output buffering and loading', url: 'https://e2e.ti.com/search?q=DAC+output+buffer+loading' },
                    { title: 'DAC reference and gain configuration', url: 'https://e2e.ti.com/search?q=DAC+reference+voltage+gain' },
                  ],
                },
              ],
            },
          },
          {
            label: 'Motor / Driver',
            icon: '⚙️',
            next: {
              id: 'hw-motor',
              question: 'What motor issue are you seeing?',
              options: [
                {
                  label: 'Motor not spinning',
                  results: [
                    { title: 'Gate driver output and enable signals', url: 'https://e2e.ti.com/search?q=motor+driver+not+spinning+enable' },
                    { title: 'H-bridge fault diagnostics', url: 'https://e2e.ti.com/search?q=H-bridge+motor+driver+fault' },
                    { title: 'DRV8xxx troubleshooting guide', url: 'https://e2e.ti.com/search?q=DRV8+troubleshooting' },
                  ],
                },
                {
                  label: 'Motor vibrates but doesn\'t rotate',
                  results: [
                    { title: 'Stepper motor phase wiring', url: 'https://e2e.ti.com/search?q=stepper+motor+vibration+wiring' },
                    { title: 'BLDC commutation sequence', url: 'https://e2e.ti.com/search?q=BLDC+commutation+sequence' },
                  ],
                },
                {
                  label: 'Overcurrent or thermal shutdown',
                  results: [
                    { title: 'Current limit setting and sense resistor', url: 'https://e2e.ti.com/search?q=motor+driver+overcurrent+limit' },
                    { title: 'Heatsink and thermal relief design', url: 'https://e2e.ti.com/search?q=motor+driver+thermal+shutdown' },
                  ],
                },
              ],
            },
          },
          {
            label: 'Interface / Communication',
            icon: '🔗',
            next: {
              id: 'hw-interface',
              question: 'Which interface?',
              options: [
                {
                  label: 'CAN / CAN-FD',
                  results: [
                    { title: 'CAN bus termination and wiring', url: 'https://e2e.ti.com/search?q=CAN+bus+termination+wiring' },
                    { title: 'CAN transceiver troubleshooting', url: 'https://e2e.ti.com/search?q=CAN+transceiver+troubleshooting' },
                    { title: 'TI CAN design guide', url: 'https://www.ti.com/interface/can-transceivers/overview.html' },
                  ],
                },
                {
                  label: 'I2C / SPI',
                  results: [
                    { title: 'I2C pull-up resistor selection', url: 'https://e2e.ti.com/search?q=I2C+pull+up+resistor+value' },
                    { title: 'SPI clock polarity and phase (CPOL/CPHA)', url: 'https://e2e.ti.com/search?q=SPI+clock+polarity+phase' },
                    { title: 'Level shifting for mixed-voltage I2C', url: 'https://e2e.ti.com/search?q=I2C+level+shifter' },
                  ],
                },
                {
                  label: 'RS-485 / RS-232',
                  results: [
                    { title: 'RS-485 termination and biasing', url: 'https://e2e.ti.com/search?q=RS485+termination+biasing' },
                    { title: 'RS-232 voltage levels and ESD protection', url: 'https://e2e.ti.com/search?q=RS232+voltage+levels+ESD' },
                  ],
                },
                {
                  label: 'USB',
                  results: [
                    { title: 'USB enumeration and connection issues', url: 'https://e2e.ti.com/search?q=USB+enumeration+connection+issue' },
                    { title: 'USB Type-C and PD configuration', url: 'https://e2e.ti.com/search?q=USB+type+C+PD+configuration' },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
    {
      label: 'Software / Firmware Issue',
      icon: '💻',
      next: {
        id: 'sw',
        question: 'What type of software issue?',
        options: [
          {
            label: 'Code Composer Studio (CCS)',
            icon: '🛠️',
            next: {
              id: 'sw-ccs',
              question: 'What CCS issue?',
              options: [
                {
                  label: 'Build errors',
                  results: [
                    { title: 'CCS build error troubleshooting', url: 'https://e2e.ti.com/search?q=code+composer+studio+build+error' },
                    { title: 'Linker and compiler settings', url: 'https://e2e.ti.com/search?q=CCS+linker+compiler+settings' },
                  ],
                },
                {
                  label: 'Debugger connection problems',
                  results: [
                    { title: 'JTAG / XDS debugger connection', url: 'https://e2e.ti.com/search?q=CCS+debugger+connection+JTAG+XDS' },
                    { title: 'Target configuration setup', url: 'https://e2e.ti.com/search?q=CCS+target+configuration' },
                  ],
                },
                {
                  label: 'Flashing / programming issues',
                  results: [
                    { title: 'Flash programming errors', url: 'https://e2e.ti.com/search?q=CCS+flash+programming+error' },
                    { title: 'UniFlash tool guide', url: 'https://www.ti.com/tool/UNIFLASH' },
                  ],
                },
              ],
            },
          },
          {
            label: 'SDK / Driver Issue',
            icon: '📦',
            results: [
              { title: 'TI SDK installation and setup', url: 'https://e2e.ti.com/search?q=SDK+installation+setup' },
              { title: 'Driver API usage and examples', url: 'https://e2e.ti.com/search?q=TI+driver+API+example' },
              { title: 'SimpleLink SDK FAQ', url: 'https://e2e.ti.com/search?q=SimpleLink+SDK+FAQ' },
            ],
          },
          {
            label: 'RTOS / OS Issue',
            icon: '🔄',
            results: [
              { title: 'TI-RTOS task and interrupt configuration', url: 'https://e2e.ti.com/search?q=TI+RTOS+task+interrupt+configuration' },
              { title: 'FreeRTOS on TI MCUs', url: 'https://e2e.ti.com/search?q=FreeRTOS+TI+MCU' },
              { title: 'Stack overflow and memory issues', url: 'https://e2e.ti.com/search?q=RTOS+stack+overflow+memory' },
            ],
          },
          {
            label: 'Peripheral configuration',
            icon: '🔌',
            next: {
              id: 'sw-periph',
              question: 'Which peripheral?',
              options: [
                {
                  label: 'Timer / PWM',
                  results: [
                    { title: 'Timer configuration and PWM generation', url: 'https://e2e.ti.com/search?q=timer+PWM+configuration+MCU' },
                    { title: 'Duty cycle and frequency calculation', url: 'https://e2e.ti.com/search?q=PWM+duty+cycle+frequency' },
                  ],
                },
                {
                  label: 'ADC / DAC',
                  results: [
                    { title: 'ADC peripheral configuration', url: 'https://e2e.ti.com/search?q=MCU+ADC+configuration+register' },
                    { title: 'DMA with ADC for high-speed sampling', url: 'https://e2e.ti.com/search?q=ADC+DMA+high+speed+sampling' },
                  ],
                },
                {
                  label: 'UART / SPI / I2C',
                  results: [
                    { title: 'UART baud rate and configuration', url: 'https://e2e.ti.com/search?q=UART+baud+rate+configuration+MCU' },
                    { title: 'SPI master/slave setup', url: 'https://e2e.ti.com/search?q=SPI+master+slave+MCU+setup' },
                    { title: 'I2C address scanning and debugging', url: 'https://e2e.ti.com/search?q=I2C+address+scan+debug' },
                  ],
                },
                {
                  label: 'GPIO / Interrupt',
                  results: [
                    { title: 'GPIO pin muxing and configuration', url: 'https://e2e.ti.com/search?q=GPIO+pin+mux+configuration' },
                    { title: 'Interrupt priority and handling', url: 'https://e2e.ti.com/search?q=interrupt+priority+handler+MCU' },
                  ],
                },
              ],
            },
          },
        ],
      },
    },
    {
      label: 'Part Selection Help',
      icon: '🔍',
      next: {
        id: 'select',
        question: 'What are you trying to select?',
        options: [
          {
            label: 'Power regulator (LDO / Switching)',
            results: [
              { title: 'LDO vs switching regulator selection', url: 'https://e2e.ti.com/search?q=LDO+vs+switching+regulator+selection' },
              { title: 'TI WEBENCH Power Designer', url: 'https://www.ti.com/design-resources/design-tools-simulation/webench-power-designer.html' },
              { title: 'Power management selection guide', url: 'https://www.ti.com/power-management/overview.html' },
            ],
          },
          {
            label: 'Microcontroller / Processor',
            results: [
              { title: 'MCU selection by peripherals and performance', url: 'https://e2e.ti.com/search?q=MCU+selection+guide+peripherals' },
              { title: 'MSP430 vs MSP432 vs C2000 comparison', url: 'https://e2e.ti.com/search?q=MSP430+vs+MSP432+vs+C2000' },
              { title: 'TI MCU Product Selector', url: 'https://www.ti.com/microcontrollers-mcus-processors/overview.html' },
            ],
          },
          {
            label: 'Amplifier / Op-amp',
            results: [
              { title: 'Op-amp selection by application', url: 'https://e2e.ti.com/search?q=op+amp+selection+application' },
              { title: 'Precision vs. high-speed op-amp tradeoffs', url: 'https://e2e.ti.com/search?q=precision+vs+high+speed+op+amp' },
              { title: 'TI Amplifier Selection Tool', url: 'https://www.ti.com/amplifier-circuit/op-amps/overview.html' },
            ],
          },
          {
            label: 'Sensor',
            results: [
              { title: 'Temperature sensor selection (analog vs digital)', url: 'https://e2e.ti.com/search?q=temperature+sensor+analog+vs+digital' },
              { title: 'Current sensing method comparison', url: 'https://e2e.ti.com/search?q=current+sensing+method+comparison' },
              { title: 'TI Sensor Selection Guide', url: 'https://www.ti.com/sensors/overview.html' },
            ],
          },
          {
            label: 'Wireless connectivity',
            results: [
              { title: 'Wi-Fi vs BLE vs Sub-1GHz comparison', url: 'https://e2e.ti.com/search?q=WiFi+vs+BLE+vs+Sub1GHz' },
              { title: 'SimpleLink platform overview', url: 'https://www.ti.com/wireless-connectivity/overview.html' },
            ],
          },
        ],
      },
    },
    {
      label: 'Design Review / Best Practices',
      icon: '📋',
      next: {
        id: 'design',
        question: 'What aspect of your design?',
        options: [
          {
            label: 'PCB layout review',
            results: [
              { title: 'PCB layout guidelines for power supplies', url: 'https://e2e.ti.com/search?q=PCB+layout+guidelines+power+supply' },
              { title: 'High-speed signal routing tips', url: 'https://e2e.ti.com/search?q=high+speed+signal+routing+PCB' },
              { title: 'Ground plane and via stitching', url: 'https://e2e.ti.com/search?q=ground+plane+via+stitching+PCB' },
            ],
          },
          {
            label: 'Schematic review',
            results: [
              { title: 'Decoupling capacitor placement', url: 'https://e2e.ti.com/search?q=decoupling+capacitor+placement' },
              { title: 'ESD protection best practices', url: 'https://e2e.ti.com/search?q=ESD+protection+design+review' },
              { title: 'Request a TI design review', url: 'https://www.ti.com/customer-support/request-form?referer=E2E&si=8' },
            ],
          },
          {
            label: 'Thermal management',
            results: [
              { title: 'Thermal pad and heatsink design', url: 'https://e2e.ti.com/search?q=thermal+pad+heatsink+design' },
              { title: 'Junction temperature calculations', url: 'https://e2e.ti.com/search?q=junction+temperature+calculation' },
            ],
          },
          {
            label: 'EMC / EMI compliance',
            results: [
              { title: 'EMI reduction techniques', url: 'https://e2e.ti.com/search?q=EMI+reduction+techniques' },
              { title: 'Spread spectrum clocking for EMC', url: 'https://e2e.ti.com/search?q=spread+spectrum+clocking+EMC' },
              { title: 'TI EMI/EMC design resources', url: 'https://www.ti.com/design-resources/design-tools-simulation.html' },
            ],
          },
        ],
      },
    },
  ],
};

function KnowledgeBank() {
  const routerNavigate = useRouterNavigate();
  const [path, setPath] = useState([]); // array of selected option indices
  const [currentNode, setCurrentNode] = useState(DECISION_TREE);

  const navigate = (option, index) => {
    if (option.results) {
      // Terminal node — show results
      setPath([...path, { label: option.label, index }]);
      setCurrentNode({ question: null, results: option.results, label: option.label });
    } else if (option.next) {
      setPath([...path, { label: option.label, index }]);
      setCurrentNode(option.next);
    }
  };

  const goBack = () => {
    if (path.length === 0) return;
    // Replay the tree from root to path.length - 1
    const newPath = path.slice(0, -1);
    let node = DECISION_TREE;
    for (const step of newPath) {
      const option = node.options[step.index];
      if (option.next) {
        node = option.next;
      }
    }
    setPath(newPath);
    setCurrentNode(node);
  };

  const reset = () => {
    setPath([]);
    setCurrentNode(DECISION_TREE);
  };

  const isResults = currentNode.results != null;

  return (
    <div className="kb-page">
      <button className="kb-home-back" onClick={() => routerNavigate('/home')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Home
      </button>
      <h1 className="kb-title" onClick={reset} style={{ cursor: 'pointer' }}>Knowledge Bank</h1>
      <p className="kb-subtitle">Answer a few questions to find relevant resources</p>

      {/* Breadcrumb */}
      {path.length > 0 && (
        <div className="kb-breadcrumb">
          <button className="kb-breadcrumb-item" onClick={reset}>Start</button>
          {path.map((step, i) => (
            <React.Fragment key={i}>
              <svg className="kb-breadcrumb-sep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
                <polyline points="9 18 15 12 9 6" />
              </svg>
              <span className={`kb-breadcrumb-item ${i === path.length - 1 ? 'active' : ''}`}>
                {step.label}
              </span>
            </React.Fragment>
          ))}
        </div>
      )}

      {/* Back button */}
      {path.length > 0 && (
        <button className="kb-back" onClick={goBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      )}

      {/* Question */}
      {!isResults && (
        <>
          <div className="kb-question">{currentNode.question}</div>
          <div className="kb-options">
            {currentNode.options.map((option, i) => (
              <button key={i} className="kb-option" onClick={() => navigate(option, i)}>
                {option.icon && <span className="kb-option-icon">{option.icon}</span>}
                <span className="kb-option-label">{option.label}</span>
                <svg className="kb-option-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                  <polyline points="9 18 15 12 9 6" />
                </svg>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Results */}
      {isResults && (
        <div className="kb-results">
          <div className="kb-results-header">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <path d="M9 12l2 2 4-4" />
              <circle cx="12" cy="12" r="10" />
            </svg>
            <span>Recommended Resources</span>
          </div>
          {currentNode.results.map((result, i) => (
            <a key={i} href={result.url} target="_blank" rel="noopener noreferrer" className="kb-result-item">
              <span className="kb-result-title">{result.title}</span>
              <svg className="kb-result-external" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ))}

          <div className="kb-results-footer">
            <button className="kb-start-over" onClick={reset}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <polyline points="1 4 1 10 7 10" />
                <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
              </svg>
              Start Over
            </button>
            <a
              href="https://e2e.ti.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="kb-e2e-link"
            >
              Search E2E Forums
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Progress indicator */}
      {!isResults && path.length > 0 && (
        <div className="kb-progress">
          <div className="kb-progress-dots">
            {[...Array(4)].map((_, i) => (
              <div key={i} className={`kb-progress-dot ${i <= path.length ? 'filled' : ''}`} />
            ))}
          </div>
          <span className="kb-progress-text">Step {path.length + 1}</span>
        </div>
      )}
    </div>
  );
}

export default KnowledgeBank;
