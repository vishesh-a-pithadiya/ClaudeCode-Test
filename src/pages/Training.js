import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Training.css';

const TRAINING_TREE = {
  'Power Management': {
    'DC/DC Converters': {
      'App Notes': [
        { name: 'AN-2162: Simple Switcher PCB Layout', url: 'https://www.ti.com/lit/an/snva603c/snva603c.pdf', type: 'appnote' },
        { name: 'AN-1149: Layout Guidelines for Switching Regulators', url: 'https://www.ti.com/lit/an/snva021c/snva021c.pdf', type: 'appnote' },
        { name: 'Basic Calculation of a Buck Converter\'s Power Stage', url: 'https://www.ti.com/lit/an/slva477b/slva477b.pdf', type: 'appnote' },
        { name: 'Understanding Buck Power Stages', url: 'https://www.ti.com/lit/an/slva057/slva057.pdf', type: 'appnote' },
        { name: 'Basic Calculation of a Boost Converter\'s Power Stage', url: 'https://www.ti.com/lit/an/slva372d/slva372d.pdf', type: 'appnote' },
        { name: 'Basic Calculation of an Inverting Power Stage', url: 'https://www.ti.com/lit/an/slva535b/slva535b.pdf', type: 'appnote' },
        { name: 'Voltage Mode vs Current Mode Control', url: 'https://www.ti.com/lit/pdf/slua119', type: 'appnote' },
        { name: 'Understanding Thermal Dissipation and Design of a Heatsink', url: 'https://www.ti.com/lit/an/slva462/slva462.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Introduction to DC/DC Converters', url: 'https://training.ti.com/introduction-dc-dc-converters', type: 'video' },
        { name: 'Buck Converter Basics', url: 'https://training.ti.com/buck-converter-basics', type: 'video' },
        { name: 'Boost Converter Design', url: 'https://training.ti.com/boost-converter-design', type: 'video' },
        { name: 'Power Stage Designer Tool', url: 'https://training.ti.com/power-stage-designer', type: 'video' },
        { name: 'EMI in DC/DC Converters', url: 'https://training.ti.com/emi-dc-dc-converters', type: 'video' },
        { name: 'Compensator Design', url: 'https://training.ti.com/compensator-design-dc-dc', type: 'video' },
      ],
    },
    'LDOs (Low-Dropout Regulators)': {
      'App Notes': [
        { name: 'LDO Basics and Design Tips', url: 'https://www.ti.com/lit/an/slva079a/slva079a.pdf', type: 'appnote' },
        { name: 'LDO PSRR Measurement', url: 'https://www.ti.com/lit/an/slaa414a/slaa414a.pdf', type: 'appnote' },
        { name: 'LDO Noise and Filtering', url: 'https://www.ti.com/lit/an/slaa652/slaa652.pdf', type: 'appnote' },
        { name: 'LDO Thermal Considerations', url: 'https://www.ti.com/lit/an/slva118a/slva118a.pdf', type: 'appnote' },
        { name: 'Capacitor Selection for LDOs', url: 'https://www.ti.com/lit/an/slva214a/slva214a.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'LDO Basics', url: 'https://training.ti.com/ldo-basics', type: 'video' },
        { name: 'Understanding LDO Noise Performance', url: 'https://training.ti.com/understanding-ldo-noise', type: 'video' },
        { name: 'LDO Stability and Transient Response', url: 'https://training.ti.com/ldo-stability', type: 'video' },
      ],
    },
    'Battery Management': {
      'App Notes': [
        { name: 'Battery Charger Design Guide', url: 'https://www.ti.com/lit/an/sluaar7/sluaar7.pdf', type: 'appnote' },
        { name: 'bq51003 & bq25120 Wearable Wireless Charging Reference Design', url: 'https://www.ti.com/lit/an/slua748/slua748.pdf', type: 'appnote' },
        { name: 'Low-Power Battery Fuel Gauging Scheme', url: 'https://www.ti.com/lit/an/slua694a/slua694a.pdf', type: 'appnote' },
        { name: 'Multi-Cell Battery Gas Gauging with bq20z70', url: 'https://www.ti.com/lit/an/slua397/slua397.pdf', type: 'appnote' },
        { name: 'bq769x0 Boot Switch Alternatives', url: 'https://www.ti.com/lit/an/slua769/slua769.pdf', type: 'appnote' },
        { name: 'Load Current Monitoring with TPS2549', url: 'https://www.ti.com/lit/an/slua842/slua842.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Battery Management Overview', url: 'https://training.ti.com/battery-management-overview', type: 'video' },
        { name: 'Fuel Gauge Technology', url: 'https://training.ti.com/fuel-gauge-technology', type: 'video' },
        { name: 'USB-C PD Charging Solutions', url: 'https://training.ti.com/usb-c-pd-charging', type: 'video' },
        { name: 'BMS for EV Applications', url: 'https://training.ti.com/bms-ev-applications', type: 'video' },
      ],
    },
    'Gate Drivers': {
      'App Notes': [
        { name: 'Fundamentals of MOSFET and IGBT Gate Driver Circuits', url: 'https://www.ti.com/lit/an/slua618a/slua618a.pdf', type: 'appnote' },
        { name: 'Half-Bridge Gate Driver Design', url: 'https://www.ti.com/lit/an/slua887/slua887.pdf', type: 'appnote' },
        { name: 'GaN FET Gate Driver Selection', url: 'https://www.ti.com/lit/an/snoaa15/snoaa15.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Gate Driver Fundamentals', url: 'https://training.ti.com/gate-driver-fundamentals', type: 'video' },
        { name: 'Isolated Gate Drivers', url: 'https://training.ti.com/isolated-gate-drivers', type: 'video' },
        { name: 'GaN Gate Driver Design', url: 'https://training.ti.com/gan-gate-driver', type: 'video' },
      ],
    },
    'LED Drivers': {
      'App Notes': [
        { name: 'LED-Driver Considerations', url: 'https://www.ti.com/lit/pdf/slyt084', type: 'appnote' },
        { name: 'Automotive LED Lighting Design', url: 'https://www.ti.com/lit/an/slva753/slva753.pdf', type: 'appnote' },
        { name: 'High-Power LED Thermal Management', url: 'https://www.ti.com/lit/an/slva559/slva559.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'LED Driver Topologies', url: 'https://training.ti.com/led-driver-topologies', type: 'video' },
        { name: 'Automotive Lighting Solutions', url: 'https://training.ti.com/automotive-lighting', type: 'video' },
      ],
    },
    'AC/DC & Isolated Power': {
      'App Notes': [
        { name: 'UC3842/3/4/5 Low-Cost Current-Mode Control', url: 'https://www.ti.com/lit/an/slua143/slua143.pdf', type: 'appnote' },
        { name: 'LLC Resonant Converter Design', url: 'https://www.ti.com/lit/an/slua582a/slua582a.pdf', type: 'appnote' },
        { name: 'Magnetics Design: Flyback Transformer Design', url: 'https://www.ti.com/lit/ml/slup127/slup127.pdf', type: 'appnote' },
        { name: '350-W Two-Phase Interleaved PFC Pre-Regulator Design Review', url: 'https://www.ti.com/lit/an/slua369/slua369.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Flyback Converter Basics', url: 'https://training.ti.com/flyback-converter-basics', type: 'video' },
        { name: 'LLC Resonant Converter', url: 'https://training.ti.com/llc-resonant-converter', type: 'video' },
        { name: 'Power Factor Correction', url: 'https://training.ti.com/power-factor-correction', type: 'video' },
      ],
    },
  },
  'Microcontrollers': {
    'MSP430': {
      'App Notes': [
        { name: 'MSP430 Ultra-Low Power Design', url: 'https://www.ti.com/lit/an/slaa545/slaa545.pdf', type: 'appnote' },
        { name: 'MSP430 Capacitive Touch Sensing', url: 'https://www.ti.com/lit/an/slaa363a/slaa363a.pdf', type: 'appnote' },
        { name: 'MSP430 ADC Usage Guide', url: 'https://www.ti.com/lit/an/slaa685/slaa685.pdf', type: 'appnote' },
        { name: 'MSP430 Clock System Guide', url: 'https://www.ti.com/lit/an/slaa322a/slaa322a.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'MSP430 Getting Started', url: 'https://training.ti.com/msp430-getting-started', type: 'video' },
        { name: 'MSP430 Low-Power Techniques', url: 'https://training.ti.com/msp430-low-power', type: 'video' },
        { name: 'MSP430 Workshop', url: 'https://training.ti.com/msp430-workshop', type: 'video' },
      ],
    },
    'C2000 Real-Time MCUs': {
      'App Notes': [
        { name: 'C2000 Digital Power Supply Design', url: 'https://www.ti.com/lit/an/spraan3/spraan3.pdf', type: 'appnote' },
        { name: 'C2000 Motor Control Primer', url: 'https://www.ti.com/lit/an/sprabq7/sprabq7.pdf', type: 'appnote' },
        { name: 'C2000 ADC Best Practices', url: 'https://www.ti.com/lit/an/spraas1/spraas1.pdf', type: 'appnote' },
        { name: 'C2000 CLA Usage Guide', url: 'https://www.ti.com/lit/an/spracs0/spracs0.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'C2000 MCU Workshop', url: 'https://training.ti.com/c2000-mcu-workshop', type: 'video' },
        { name: 'C2000 Digital Power Control', url: 'https://training.ti.com/c2000-digital-power', type: 'video' },
        { name: 'C2000 Motor Control Lab', url: 'https://training.ti.com/c2000-motor-control', type: 'video' },
      ],
    },
    'TM4C (Tiva C)': {
      'App Notes': [
        { name: 'TM4C Peripheral Driver Library Guide', url: 'https://www.ti.com/lit/ug/spmu298e/spmu298e.pdf', type: 'appnote' },
        { name: 'TM4C Ethernet Applications', url: 'https://www.ti.com/lit/an/spma075/spma075.pdf', type: 'appnote' },
        { name: 'TM4C USB Development Guide', url: 'https://www.ti.com/lit/an/spma060/spma060.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'TM4C Getting Started', url: 'https://training.ti.com/tm4c-getting-started', type: 'video' },
        { name: 'TM4C Workshop Series', url: 'https://training.ti.com/tm4c-workshop', type: 'video' },
      ],
    },
    'MSPM0': {
      'App Notes': [
        { name: 'MSPM0 Migration from MSP430', url: 'https://www.ti.com/lit/an/slaaee3/slaaee3.pdf', type: 'appnote' },
        { name: 'MSPM0 SysConfig Usage Guide', url: 'https://www.ti.com/lit/an/slaaee5/slaaee5.pdf', type: 'appnote' },
        { name: 'MSPM0 Low-Power Modes', url: 'https://www.ti.com/lit/an/slaaee4/slaaee4.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'MSPM0 Quick Start', url: 'https://training.ti.com/mspm0-quick-start', type: 'video' },
        { name: 'MSPM0 Workshop', url: 'https://training.ti.com/mspm0-workshop', type: 'video' },
      ],
    },
  },
  'Processors': {
    'Sitara (AM series)': {
      'App Notes': [
        { name: 'AM335x Boot Process Guide', url: 'https://www.ti.com/lit/an/sprac74/sprac74.pdf', type: 'appnote' },
        { name: 'AM62x Starter Kit Guide', url: 'https://www.ti.com/lit/ug/spruja4/spruja4.pdf', type: 'appnote' },
        { name: 'AM64x Industrial Communication', url: 'https://www.ti.com/lit/an/spracy7/spracy7.pdf', type: 'appnote' },
        { name: 'Linux SDK Getting Started', url: 'https://www.ti.com/lit/ug/spruid7e/spruid7e.pdf', type: 'appnote' },
        { name: 'PRU-ICSS Programming Guide', url: 'https://www.ti.com/lit/ug/spruhv7a/spruhv7a.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Sitara Processor Overview', url: 'https://training.ti.com/sitara-processor-overview', type: 'video' },
        { name: 'AM62x Getting Started', url: 'https://training.ti.com/am62x-getting-started', type: 'video' },
        { name: 'Edge AI with Sitara', url: 'https://training.ti.com/edge-ai-sitara', type: 'video' },
        { name: 'Linux Kernel Development', url: 'https://training.ti.com/linux-kernel-development', type: 'video' },
      ],
    },
    'TDA4x (Jacinto)': {
      'App Notes': [
        { name: 'TDA4VM Vision Processing Design', url: 'https://www.ti.com/lit/an/spracn4/spracn4.pdf', type: 'appnote' },
        { name: 'TDA4 Deep Learning Accelerator', url: 'https://www.ti.com/lit/an/spracy2/spracy2.pdf', type: 'appnote' },
        { name: 'ADAS Camera System Design', url: 'https://www.ti.com/lit/an/spracl4/spracl4.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'TDA4x ADAS Overview', url: 'https://training.ti.com/tda4x-adas-overview', type: 'video' },
        { name: 'Edge AI on TDA4VM', url: 'https://training.ti.com/edge-ai-tda4vm', type: 'video' },
      ],
    },
    'DSP (C6000/C7000)': {
      'App Notes': [
        { name: 'DSP Optimization Techniques', url: 'https://www.ti.com/lit/an/spra829/spra829.pdf', type: 'appnote' },
        { name: 'FFT Implementation on C6000', url: 'https://www.ti.com/lit/an/spra291/spra291.pdf', type: 'appnote' },
        { name: 'C7x MMA Programming Guide', url: 'https://www.ti.com/lit/ug/spruj52/spruj52.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'DSP Fundamentals', url: 'https://training.ti.com/dsp-fundamentals', type: 'video' },
        { name: 'C7000 Architecture Overview', url: 'https://training.ti.com/c7000-architecture', type: 'video' },
      ],
    },
  },
  'Analog & Signal Chain': {
    'Op Amps': {
      'App Notes': [
        { name: 'Op Amp Stability and Compensation', url: 'https://www.ti.com/lit/an/sloa020a/sloa020a.pdf', type: 'appnote' },
        { name: 'Single-Supply Op Amp Design', url: 'https://www.ti.com/lit/an/sloa030a/sloa030a.pdf', type: 'appnote' },
        { name: 'Noise Analysis for Op Amps', url: 'https://www.ti.com/lit/an/slva043b/slva043b.pdf', type: 'appnote' },
        { name: 'Active Filter Design Guide', url: 'https://www.ti.com/lit/an/sloa049d/sloa049d.pdf', type: 'appnote' },
        { name: 'SPICE Simulation for Op Amps', url: 'https://www.ti.com/lit/an/sloa070/sloa070.pdf', type: 'appnote' },
        { name: 'Instrumentation Amplifier Design', url: 'https://www.ti.com/lit/an/sbaa331/sbaa331.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'TI Precision Labs - Op Amps', url: 'https://training.ti.com/ti-precision-labs-op-amps', type: 'video' },
        { name: 'Op Amp Input Offset Voltage', url: 'https://training.ti.com/op-amp-input-offset', type: 'video' },
        { name: 'Op Amp Bandwidth', url: 'https://training.ti.com/op-amp-bandwidth', type: 'video' },
        { name: 'Op Amp Slew Rate', url: 'https://training.ti.com/op-amp-slew-rate', type: 'video' },
        { name: 'Op Amp Noise', url: 'https://training.ti.com/op-amp-noise', type: 'video' },
      ],
    },
    'ADCs (Analog-to-Digital)': {
      'App Notes': [
        { name: 'Understanding ADC Specifications', url: 'https://www.ti.com/lit/an/slaa013/slaa013.pdf', type: 'appnote' },
        { name: 'SAR ADC Input Driver Design', url: 'https://www.ti.com/lit/an/sbaa266/sbaa266.pdf', type: 'appnote' },
        { name: 'Delta-Sigma ADC Basics', url: 'https://www.ti.com/lit/an/sbaa230/sbaa230.pdf', type: 'appnote' },
        { name: 'ADC Layout Best Practices', url: 'https://www.ti.com/lit/an/slaa601/slaa601.pdf', type: 'appnote' },
        { name: 'Reference Design for Precision ADC', url: 'https://www.ti.com/lit/an/sbaa285/sbaa285.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'TI Precision Labs - ADCs', url: 'https://training.ti.com/ti-precision-labs-adcs', type: 'video' },
        { name: 'SAR vs Delta-Sigma ADCs', url: 'https://training.ti.com/sar-vs-delta-sigma', type: 'video' },
        { name: 'ADC Input Driver Design', url: 'https://training.ti.com/adc-input-driver', type: 'video' },
        { name: 'High-Speed ADC Design', url: 'https://training.ti.com/high-speed-adc', type: 'video' },
      ],
    },
    'DACs (Digital-to-Analog)': {
      'App Notes': [
        { name: 'DAC Basics and Specifications', url: 'https://www.ti.com/lit/an/slaa587/slaa587.pdf', type: 'appnote' },
        { name: 'Precision DAC Output Filtering', url: 'https://www.ti.com/lit/an/sbaa341/sbaa341.pdf', type: 'appnote' },
        { name: 'DAC Output Amplifier Design', url: 'https://www.ti.com/lit/an/sbaa150/sbaa150.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'TI Precision Labs - DACs', url: 'https://training.ti.com/ti-precision-labs-dacs', type: 'video' },
        { name: 'DAC Architecture Overview', url: 'https://training.ti.com/dac-architecture', type: 'video' },
      ],
    },
    'Comparators': {
      'App Notes': [
        { name: 'Comparator with Hysteresis Design', url: 'https://www.ti.com/lit/an/slaa835/slaa835.pdf', type: 'appnote' },
        { name: 'Window Comparator Circuit', url: 'https://www.ti.com/lit/an/slva418/slva418.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'TI Precision Labs - Comparators', url: 'https://training.ti.com/ti-precision-labs-comparators', type: 'video' },
      ],
    },
    'Current & Voltage Sensing': {
      'App Notes': [
        { name: 'Current Sensing Amplifier Design', url: 'https://www.ti.com/lit/an/sboa313/sboa313.pdf', type: 'appnote' },
        { name: 'High-Side vs Low-Side Sensing', url: 'https://www.ti.com/lit/an/sboa307/sboa307.pdf', type: 'appnote' },
        { name: 'Bidirectional Current Sensing', url: 'https://www.ti.com/lit/an/sboa311/sboa311.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Current Sense Amplifier Basics', url: 'https://training.ti.com/current-sense-amplifier', type: 'video' },
        { name: 'Shunt Resistor Selection', url: 'https://training.ti.com/shunt-resistor-selection', type: 'video' },
      ],
    },
  },
  'Motor Drivers': {
    'Brushed DC Motors': {
      'App Notes': [
        { name: 'DRV8xx Brushed DC Motor Control', url: 'https://www.ti.com/lit/an/slva859/slva859.pdf', type: 'appnote' },
        { name: 'H-Bridge Motor Driver Design', url: 'https://www.ti.com/lit/an/slva642/slva642.pdf', type: 'appnote' },
        { name: 'Driving BLDC Motors with PWM Generation Mode', url: 'https://www.ti.com/lit/pdf/slvafl7', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Brushed DC Motor Driver Basics', url: 'https://training.ti.com/brushed-dc-motor-basics', type: 'video' },
        { name: 'DRV8xx Family Overview', url: 'https://training.ti.com/drv8xx-overview', type: 'video' },
      ],
    },
    'Brushless DC (BLDC) Motors': {
      'App Notes': [
        { name: 'Sensorless BLDC Motor Control', url: 'https://www.ti.com/lit/an/slua640/slua640.pdf', type: 'appnote' },
        { name: 'FOC Motor Control with MCU', url: 'https://www.ti.com/lit/an/sprabq8/sprabq8.pdf', type: 'appnote' },
        { name: 'BLDC Trapezoidal Commutation', url: 'https://www.ti.com/lit/an/sprabz4/sprabz4.pdf', type: 'appnote' },
        { name: 'Motor Driver Thermal Design', url: 'https://www.ti.com/lit/an/slva915/slva915.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'BLDC Motor Control Fundamentals', url: 'https://training.ti.com/bldc-motor-fundamentals', type: 'video' },
        { name: 'Field Oriented Control (FOC)', url: 'https://training.ti.com/foc-motor-control', type: 'video' },
        { name: 'Sensorless Motor Control', url: 'https://training.ti.com/sensorless-motor', type: 'video' },
      ],
    },
    'Stepper Motors': {
      'App Notes': [
        { name: 'Stepper Motor Driver Basics', url: 'https://www.ti.com/lit/an/slva591/slva591.pdf', type: 'appnote' },
        { name: 'Microstepping Design Guide', url: 'https://www.ti.com/lit/an/slva593/slva593.pdf', type: 'appnote' },
        { name: 'DRV8825 Design Guide', url: 'https://www.ti.com/lit/an/slva659/slva659.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Stepper Motor Driving Basics', url: 'https://training.ti.com/stepper-motor-basics', type: 'video' },
        { name: 'Microstepping Explained', url: 'https://training.ti.com/microstepping-explained', type: 'video' },
      ],
    },
  },
  'Interface & Connectivity': {
    'USB': {
      'App Notes': [
        { name: 'PD Alternate Mode: DisplayPort', url: 'https://www.ti.com/lit/an/slva844/slva844.pdf', type: 'appnote' },
        { name: 'High-Speed Layout Guidelines for USB Hubs and Signal Conditioners', url: 'https://www.ti.com/lit/an/slla414/slla414.pdf', type: 'appnote' },
        { name: 'USB Signal Integrity Guide', url: 'https://www.ti.com/lit/an/slla414a/slla414a.pdf', type: 'appnote' },
        { name: 'TUSB1002A Redriver Design', url: 'https://www.ti.com/lit/an/slla406/slla406.pdf', type: 'appnote' },
        { name: 'USB ESD Protection', url: 'https://www.ti.com/lit/an/slvaf82/slvaf82.pdf', type: 'appnote' },
        { name: 'USB Type-C Guide', url: 'https://www.ti.com/lit/eb/slyy228/slyy228.pdf?HQS=app-ipp-pwr-denusbc-bhp-ebook-null-de', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'USB Overview', url: 'https://www.ti.com/video/series/precision-labs/ti-precision-labs-usb.html?keyMatch=USB&tisearch=universal_search&f-videos=Video,Video%20series', type: 'video' },
        { name: 'USB Type-C Overview', url: 'https://training.ti.com/usb-type-c-overview', type: 'video' },
        { name: 'USB Power Delivery', url: 'https://training.ti.com/usb-power-delivery', type: 'video' },
        { name: 'USB Hub Design', url: 'https://training.ti.com/usb-hub-design', type: 'video' },
        { name: 'USB Redriver vs Retimer', url: 'https://www.ti.com/video/6144123457001?keyMatch=redriver&tisearch=universal_search&f-videos=Video,Video%20series', type: 'video' },
        { name: 'USB Redriver Solutions', url: 'https://www.ti.com/video/series/precision-labs/ti-precision-labs-usb.html?keyMatch=USB&tisearch=universal_search&f-videos=Video,Video%20series', type: 'video' },
      ],
    },
    'CAN / CAN-FD': {
      'App Notes': [
        { name: 'CAN Bus Basics', url: 'https://www.ti.com/lit/an/sloa101b/sloa101b.pdf', type: 'appnote' },
        { name: 'CAN-FD Design Guide', url: 'https://www.ti.com/lit/an/slla455/slla455.pdf', type: 'appnote' },
        { name: 'CAN Bus Termination Guide', url: 'https://www.ti.com/lit/an/slla279/slla279.pdf', type: 'appnote' },
        { name: 'CAN Transceiver Selection', url: 'https://www.ti.com/lit/an/slla337/slla337.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'CAN & CAN-FD Overview', url: 'https://training.ti.com/can-overview', type: 'video' },
        { name: 'CAN Bus Design Tips', url: 'https://training.ti.com/can-bus-design-tips', type: 'video' },
      ],
    },
    'RS-485 / RS-232': {
      'App Notes': [
        { name: 'RS-485 Design Guide', url: 'https://www.ti.com/lit/an/slla272c/slla272c.pdf', type: 'appnote' },
        { name: 'RS-485 Failsafe Biasing', url: 'https://www.ti.com/lit/an/slla070d/slla070d.pdf', type: 'appnote' },
        { name: 'RS-232 to RS-485 Conversion', url: 'https://www.ti.com/lit/an/slyt514/slyt514.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'RS-485 Basics', url: 'https://training.ti.com/rs-485-basics', type: 'video' },
        { name: 'Industrial RS-485 Design', url: 'https://training.ti.com/industrial-rs-485', type: 'video' },
      ],
    },
    'Ethernet': {
      'App Notes': [
        { name: 'Ethernet PHY Design Guide', url: 'https://www.ti.com/lit/an/snla387/snla387.pdf', type: 'appnote' },
        { name: 'Industrial Ethernet Protocols', url: 'https://www.ti.com/lit/an/spry254/spry254.pdf', type: 'appnote' },
        { name: 'PoE System Design', url: 'https://www.ti.com/lit/an/slva764/slva764.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Ethernet PHY Fundamentals', url: 'https://training.ti.com/ethernet-phy-fundamentals', type: 'video' },
        { name: 'Industrial Ethernet Overview', url: 'https://training.ti.com/industrial-ethernet', type: 'video' },
        { name: 'Power over Ethernet Design', url: 'https://training.ti.com/poe-design', type: 'video' },
      ],
    },
    'I2C / SPI': {
      'App Notes': [
        { name: 'Understanding the I2C Bus', url: 'https://www.ti.com/lit/an/slva704/slva704.pdf', type: 'appnote' },
        { name: 'I2C Level Shifting Techniques', url: 'https://www.ti.com/lit/an/slva689/slva689.pdf', type: 'appnote' },
        { name: 'SPI Interface Best Practices', url: 'https://www.ti.com/lit/an/slaa698/slaa698.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'I2C Protocol Deep Dive', url: 'https://training.ti.com/i2c-protocol', type: 'video' },
        { name: 'SPI Communication Basics', url: 'https://training.ti.com/spi-basics', type: 'video' },
      ],
    },
  },
  'Wireless': {
    'Wi-Fi': {
      'App Notes': [
        { name: 'CC3235 Wi-Fi Design Guide', url: 'https://www.ti.com/lit/an/swra646/swra646.pdf', type: 'appnote' },
        { name: 'Wi-Fi Antenna Design Guide', url: 'https://www.ti.com/lit/an/swru120d/swru120d.pdf', type: 'appnote' },
        { name: 'Wi-Fi Provisioning Methods', url: 'https://www.ti.com/lit/an/swra513/swra513.pdf', type: 'appnote' },
        { name: 'Wi-Fi Security Best Practices', url: 'https://www.ti.com/lit/an/swra589/swra589.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'SimpleLink Wi-Fi Overview', url: 'https://training.ti.com/simplelink-wifi-overview', type: 'video' },
        { name: 'Wi-Fi Network Processor', url: 'https://training.ti.com/wifi-network-processor', type: 'video' },
        { name: 'CC3235 Getting Started', url: 'https://training.ti.com/cc3235-getting-started', type: 'video' },
      ],
    },
    'Bluetooth / BLE': {
      'App Notes': [
        { name: 'CC2640R2 BLE Design Guide', url: 'https://www.ti.com/lit/an/swra580/swra580.pdf', type: 'appnote' },
        { name: 'BLE Antenna Design', url: 'https://www.ti.com/lit/an/swra351c/swra351c.pdf', type: 'appnote' },
        { name: 'BLE5 Long Range Design', url: 'https://www.ti.com/lit/an/swra636/swra636.pdf', type: 'appnote' },
        { name: 'BLE Mesh Networking', url: 'https://www.ti.com/lit/an/swra649/swra649.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'BLE Fundamentals', url: 'https://training.ti.com/ble-fundamentals', type: 'video' },
        { name: 'SimpleLink BLE Workshop', url: 'https://training.ti.com/simplelink-ble-workshop', type: 'video' },
        { name: 'BLE5 Features Overview', url: 'https://training.ti.com/ble5-features', type: 'video' },
      ],
    },
    'Sub-1 GHz': {
      'App Notes': [
        { name: 'Sub-1 GHz System Design', url: 'https://www.ti.com/lit/an/swra479a/swra479a.pdf', type: 'appnote' },
        { name: 'CC1310 Range Optimization', url: 'https://www.ti.com/lit/an/swra496/swra496.pdf', type: 'appnote' },
        { name: 'Star Network Topology Guide', url: 'https://www.ti.com/lit/an/swra567b/swra567b.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Sub-1 GHz Basics', url: 'https://training.ti.com/sub-1-ghz-basics', type: 'video' },
        { name: 'Long-Range IoT Design', url: 'https://training.ti.com/long-range-iot', type: 'video' },
      ],
    },
    'Zigbee / Thread / Matter': {
      'App Notes': [
        { name: 'Zigbee 3.0 Getting Started', url: 'https://www.ti.com/lit/an/swra627/swra627.pdf', type: 'appnote' },
        { name: 'Thread Network Design', url: 'https://www.ti.com/lit/an/swra650/swra650.pdf', type: 'appnote' },
        { name: 'Matter Protocol Overview', url: 'https://www.ti.com/lit/an/swra698/swra698.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Zigbee Fundamentals', url: 'https://training.ti.com/zigbee-fundamentals', type: 'video' },
        { name: 'Thread & Matter Overview', url: 'https://training.ti.com/thread-matter-overview', type: 'video' },
      ],
    },
  },
  'Sensors': {
    'Temperature Sensors': {
      'App Notes': [
        { name: 'Temperature Sensor Selection Guide', url: 'https://www.ti.com/lit/an/sboa271/sboa271.pdf', type: 'appnote' },
        { name: 'TMP117 High-Accuracy Design', url: 'https://www.ti.com/lit/an/sbea017/sbea017.pdf', type: 'appnote' },
        { name: 'Thermocouple Signal Conditioning', url: 'https://www.ti.com/lit/an/sbaa274/sbaa274.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Temperature Sensing Overview', url: 'https://training.ti.com/temperature-sensing', type: 'video' },
        { name: 'Digital vs Analog Temp Sensors', url: 'https://training.ti.com/digital-vs-analog-temp', type: 'video' },
      ],
    },
    'mmWave Radar': {
      'App Notes': [
        { name: 'mmWave Radar Basics', url: 'https://www.ti.com/lit/an/swra553a/swra553a.pdf', type: 'appnote' },
        { name: 'People Counting with mmWave', url: 'https://www.ti.com/lit/an/swra581b/swra581b.pdf', type: 'appnote' },
        { name: 'mmWave Antenna Design', url: 'https://www.ti.com/lit/an/swra632/swra632.pdf', type: 'appnote' },
        { name: 'Vital Signs Monitoring with mmWave', url: 'https://www.ti.com/lit/pdf/swra810', type: 'appnote' },
        { name: 'Object Detection & Tracking', url: 'https://www.ti.com/lit/an/swra588/swra588.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'mmWave Sensor Fundamentals', url: 'https://training.ti.com/mmwave-fundamentals', type: 'video' },
        { name: 'Industrial mmWave Applications', url: 'https://training.ti.com/industrial-mmwave', type: 'video' },
        { name: 'Automotive Radar Design', url: 'https://training.ti.com/automotive-radar', type: 'video' },
        { name: 'mmWave FMCW Radar Workshop', url: 'https://training.ti.com/mmwave-fmcw-workshop', type: 'video' },
      ],
    },
    'Hall Effect & Current': {
      'App Notes': [
        { name: 'Hall Effect Sensor Selection', url: 'https://www.ti.com/lit/an/slva866/slva866.pdf', type: 'appnote' },
        { name: 'Magnetic Position Sensing', url: 'https://www.ti.com/lit/an/slya062/slya062.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Hall Effect Sensing Basics', url: 'https://training.ti.com/hall-effect-basics', type: 'video' },
        { name: 'Position Sensing Solutions', url: 'https://training.ti.com/position-sensing', type: 'video' },
      ],
    },
  },
  'Isolation & Protection': {
    'Digital Isolators': {
      'App Notes': [
        { name: 'Digital Isolator Design Guide', url: 'https://www.ti.com/lit/an/slla284b/slla284b.pdf', type: 'appnote' },
        { name: 'Isolated Power Supply Design', url: 'https://www.ti.com/lit/an/snva994a/snva994a.pdf', type: 'appnote' },
        { name: 'Reinforced Isolation Explained', url: 'https://www.ti.com/lit/an/slla375/slla375.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'Isolation Technology Overview', url: 'https://training.ti.com/isolation-overview', type: 'video' },
        { name: 'Capacitive vs Magnetic Isolation', url: 'https://training.ti.com/capacitive-vs-magnetic', type: 'video' },
      ],
    },
    'ESD Protection': {
      'App Notes': [
        { name: 'ESD Protection Selection Guide', url: 'https://www.ti.com/lit/an/slva663/slva663.pdf', type: 'appnote' },
        { name: 'TVS Diode Circuit Design', url: 'https://www.ti.com/lit/an/slva711/slva711.pdf', type: 'appnote' },
        { name: 'System-Level ESD Design', url: 'https://www.ti.com/lit/an/slva680/slva680.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'ESD Fundamentals', url: 'https://training.ti.com/esd-fundamentals', type: 'video' },
        { name: 'TVS Selection Guide', url: 'https://training.ti.com/tvs-selection', type: 'video' },
      ],
    },
    'eFuse & Power Switches': {
      'App Notes': [
        { name: 'eFuse Design Guide', url: 'https://www.ti.com/lit/an/slva780/slva780.pdf', type: 'appnote' },
        { name: 'Hot-Swap Controller Design', url: 'https://www.ti.com/lit/an/slva733/slva733.pdf', type: 'appnote' },
        { name: 'Load Switch Selection', url: 'https://www.ti.com/lit/an/slva652/slva652.pdf', type: 'appnote' },
      ],
      'Training Videos': [
        { name: 'eFuse vs Discrete Protection', url: 'https://training.ti.com/efuse-vs-discrete', type: 'video' },
        { name: 'Load Switch Basics', url: 'https://training.ti.com/load-switch-basics', type: 'video' },
      ],
    },
  },
};

const LEVEL_LABELS = ['Category', 'Topic', 'Content Type'];

function Training() {
  const navigate = useNavigate();
  const [path, setPath] = useState([]);

  const getCurrentItems = () => {
    let node = TRAINING_TREE;
    for (const key of path) {
      node = node[key];
    }
    return node;
  };

  const items = getCurrentItems();
  const isResources = Array.isArray(items);
  const currentLevel = path.length;

  const goBack = () => {
    setPath(path.slice(0, -1));
  };

  const selectItem = (key) => {
    setPath([...path, key]);
  };

  const getTypeIcon = (type) => {
    if (type === 'video') {
      return (
        <svg className="training-type-icon training-type-video" viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
          <path d="M8 5v14l11-7z" />
        </svg>
      );
    }
    return (
      <svg className="training-type-icon training-type-appnote" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <polyline points="14 2 14 8 20 8" />
        <line x1="16" y1="13" x2="8" y2="13" />
        <line x1="16" y1="17" x2="8" y2="17" />
      </svg>
    );
  };

  return (
    <div className="training-page">
      <button className="training-home-back" onClick={() => navigate('/home')}>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
          <polyline points="15 18 9 12 15 6" />
        </svg>
        Home
      </button>
      <h1>Training</h1>

      {/* Breadcrumb */}
      <div className="training-breadcrumb">
        <button
          className={`breadcrumb-item ${path.length === 0 ? 'active' : ''}`}
          onClick={() => setPath([])}
        >
          All
        </button>
        {path.map((segment, i) => (
          <React.Fragment key={i}>
            <svg className="breadcrumb-sep" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" width="12" height="12">
              <polyline points="9 18 15 12 9 6" />
            </svg>
            <button
              className={`breadcrumb-item ${i === path.length - 1 ? 'active' : ''}`}
              onClick={() => setPath(path.slice(0, i + 1))}
            >
              {segment}
            </button>
          </React.Fragment>
        ))}
      </div>

      {/* Level indicator */}
      <div className="training-level">
        {currentLevel < LEVEL_LABELS.length
          ? `Select ${LEVEL_LABELS[currentLevel]}`
          : 'Browse Resources'}
      </div>

      {/* Back button */}
      {path.length > 0 && (
        <button className="training-back" onClick={goBack}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Back
        </button>
      )}

      {/* Items */}
      <div className="training-tree-list">
        {isResources ? (
          items.map((item, i) => (
            <a key={i} href={item.url} target="_blank" rel="noopener noreferrer" className="training-resource-item">
              {getTypeIcon(item.type)}
              <span className="training-resource-name">{item.name}</span>
              <svg className="training-external" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          ))
        ) : (
          Object.keys(items).map((key) => {
            const child = items[key];
            const count = countResources(child);
            return (
              <button key={key} className="training-tree-item" onClick={() => selectItem(key)}>
                <span className="training-tree-item-name">{key}</span>
                <div className="training-tree-item-right">
                  <span className="training-tree-item-count">{count}</span>
                  <svg className="training-tree-chevron" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </div>
              </button>
            );
          })
        )}
      </div>
    </div>
  );
}

function countResources(node) {
  if (Array.isArray(node)) return node.length;
  let count = 0;
  for (const key of Object.keys(node)) {
    count += countResources(node[key]);
  }
  return count;
}

export default Training;
