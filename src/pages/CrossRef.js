import React, { useState, useRef, useEffect } from 'react';
import './CrossRef.css';

// Cross-reference database: competitor part → TI equivalent(s)
// Each entry: { competitor, manufacturer, tiParts: [{ part, description, url, price1k }] }
// price1k = approximate USD price per unit at 1,000-unit quantity
const CROSSREF_DB = [
  // --- Analog Devices (ADI) ---
  { competitor: 'AD8221', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'INA128', description: 'Precision, Low-Power Instrumentation Amplifier', url: 'https://www.ti.com/product/INA128', price1k: 3.52 }] },
  { competitor: 'AD620', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'INA118', description: 'Precision, Low-Power Instrumentation Amplifier', url: 'https://www.ti.com/product/INA118', price1k: 3.15 }] },
  { competitor: 'AD8605', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'OPA340', description: 'Single, Low-Power, Rail-to-Rail Op Amp', url: 'https://www.ti.com/product/OPA340', price1k: 1.10 }] },
  { competitor: 'AD8628', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'OPA335', description: 'Zero-Drift, Single-Supply Op Amp', url: 'https://www.ti.com/product/OPA335', price1k: 1.45 }] },
  { competitor: 'AD7124', manufacturer: 'Analog Devices', category: 'Data Converters', tiParts: [{ part: 'ADS1248', description: '24-Bit, 2kSPS Delta-Sigma ADC', url: 'https://www.ti.com/product/ADS1248', price1k: 5.95 }] },
  { competitor: 'AD7606', manufacturer: 'Analog Devices', category: 'Data Converters', tiParts: [{ part: 'ADS8688', description: '16-Bit, 500kSPS, 8-Channel SAR ADC', url: 'https://www.ti.com/product/ADS8688', price1k: 8.50 }] },
  { competitor: 'AD5689', manufacturer: 'Analog Devices', category: 'Data Converters', tiParts: [{ part: 'DAC8562', description: '16-Bit, Dual, Low-Power DAC', url: 'https://www.ti.com/product/DAC8562', price1k: 4.25 }] },
  { competitor: 'AD9361', manufacturer: 'Analog Devices', category: 'RF & Wireless', tiParts: [{ part: 'AFE7769', description: 'Quad-Channel RF Transceiver', url: 'https://www.ti.com/product/AFE7769', price1k: 42.00 }] },
  { competitor: 'ADP2303', manufacturer: 'Analog Devices', category: 'Power Management', tiParts: [{ part: 'TPS54302', description: '3A, 28V, Step-Down Converter', url: 'https://www.ti.com/product/TPS54302', price1k: 0.73 }] },
  { competitor: 'ADP1720', manufacturer: 'Analog Devices', category: 'Power Management', tiParts: [{ part: 'TPS7A20', description: '250mA, Low-Noise LDO Regulator', url: 'https://www.ti.com/product/TPS7A20', price1k: 0.35 }] },
  { competitor: 'ADXL345', manufacturer: 'Analog Devices', category: 'Sensors', tiParts: [{ part: 'ADXL345-ALT', description: 'See TI mmWave sensors for motion detection', url: 'https://www.ti.com/sensors/overview.html', price1k: null }] },
  { competitor: 'ADG1608', manufacturer: 'Analog Devices', category: 'Switches & Mux', tiParts: [{ part: 'MUX36S08', description: '36V, Low-Capacitance 8:1 Mux', url: 'https://www.ti.com/product/MUX36S08', price1k: 1.85 }] },
  { competitor: 'AD8418', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'INA240', description: 'High-Side, Bidirectional Current Sense Amp', url: 'https://www.ti.com/product/INA240', price1k: 1.20 }] },

  // --- Microchip / Atmel ---
  { competitor: 'ATmega328P', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'MSP430FR2355', description: '16-Bit, FRAM MCU with ADC', url: 'https://www.ti.com/product/MSP430FR2355', price1k: 1.60 }] },
  { competitor: 'ATmega2560', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'MSP430FR5994', description: '16-Bit, Ultra-Low-Power FRAM MCU', url: 'https://www.ti.com/product/MSP430FR5994', price1k: 3.20 }] },
  { competitor: 'ATSAMD21', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'CC2340', description: 'SimpleLink Arm Cortex-M0+ BLE MCU', url: 'https://www.ti.com/product/CC2340R5', price1k: 1.45 }] },
  { competitor: 'PIC16F877A', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'MSP430G2553', description: '16-Bit, Mixed-Signal MCU', url: 'https://www.ti.com/product/MSP430G2553', price1k: 1.05 }] },
  { competitor: 'PIC32MX', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'TM4C123GH6PM', description: '32-Bit ARM Cortex-M4F MCU', url: 'https://www.ti.com/product/TM4C123GH6PM', price1k: 5.50 }] },
  { competitor: 'MCP2515', manufacturer: 'Microchip', category: 'Interface', tiParts: [{ part: 'TCAN4550', description: 'CAN FD Controller with Transceiver', url: 'https://www.ti.com/product/TCAN4550', price1k: 2.85 }] },
  { competitor: 'MCP4725', manufacturer: 'Microchip', category: 'Data Converters', tiParts: [{ part: 'DAC5311', description: '8-Bit, Single-Channel DAC', url: 'https://www.ti.com/product/DAC5311', price1k: 0.55 }] },
  { competitor: 'MCP3008', manufacturer: 'Microchip', category: 'Data Converters', tiParts: [{ part: 'ADS7828', description: '12-Bit, 8-Channel ADC', url: 'https://www.ti.com/product/ADS7828', price1k: 2.40 }] },

  // --- STMicroelectronics ---
  { competitor: 'STM32F103', manufacturer: 'STMicroelectronics', category: 'MCU', tiParts: [{ part: 'TM4C1294NCPDT', description: '32-Bit ARM Cortex-M4F Connected MCU', url: 'https://www.ti.com/product/TM4C1294NCPDT', price1k: 9.95 }] },
  { competitor: 'STM32F407', manufacturer: 'STMicroelectronics', category: 'MCU', tiParts: [{ part: 'AM2434', description: 'Sitara ARM Cortex-R5F Processor', url: 'https://www.ti.com/product/AM2434', price1k: 16.50 }] },
  { competitor: 'STM32L476', manufacturer: 'STMicroelectronics', category: 'MCU', tiParts: [{ part: 'MSP432P401R', description: '32-Bit ARM Cortex-M4F Low-Power MCU', url: 'https://www.ti.com/product/MSP432P401R', price1k: 4.75 }] },
  { competitor: 'STM32H743', manufacturer: 'STMicroelectronics', category: 'MCU', tiParts: [{ part: 'AM6232', description: 'Sitara ARM Cortex-A53 Processor', url: 'https://www.ti.com/product/AM6232', price1k: 12.90 }] },
  { competitor: 'L298N', manufacturer: 'STMicroelectronics', category: 'Motor Drivers', tiParts: [{ part: 'DRV8871', description: '3.6A H-Bridge Motor Driver', url: 'https://www.ti.com/product/DRV8871', price1k: 1.15 }] },
  { competitor: 'L7805', manufacturer: 'STMicroelectronics', category: 'Power Management', tiParts: [{ part: 'LM340', description: '5V, 1.5A Fixed Voltage Regulator', url: 'https://www.ti.com/product/LM340', price1k: 0.52 }] },
  { competitor: 'LD1117', manufacturer: 'STMicroelectronics', category: 'Power Management', tiParts: [{ part: 'TLV1117', description: '800mA, Low-Dropout Regulator', url: 'https://www.ti.com/product/TLV1117', price1k: 0.38 }] },
  { competitor: 'VL53L0X', manufacturer: 'STMicroelectronics', category: 'Sensors', tiParts: [{ part: 'OPT3101', description: 'Time-of-Flight Sensor', url: 'https://www.ti.com/product/OPT3101', price1k: 3.75 }] },

  // --- NXP ---
  { competitor: 'LPC1768', manufacturer: 'NXP', category: 'MCU', tiParts: [{ part: 'TM4C1294NCPDT', description: '32-Bit ARM Cortex-M4F MCU with Ethernet', url: 'https://www.ti.com/product/TM4C1294NCPDT', price1k: 9.95 }] },
  { competitor: 'i.MX6', manufacturer: 'NXP', category: 'Processors', tiParts: [{ part: 'AM625', description: 'Sitara ARM Cortex-A53 Processor', url: 'https://www.ti.com/product/AM625', price1k: 9.00 }] },
  { competitor: 'i.MX8M', manufacturer: 'NXP', category: 'Processors', tiParts: [{ part: 'AM62A7', description: 'Sitara Vision Processor with AI', url: 'https://www.ti.com/product/AM62A7', price1k: 18.00 }] },
  { competitor: 'TJA1050', manufacturer: 'NXP', category: 'Interface', tiParts: [{ part: 'TCAN330', description: 'CAN Transceiver', url: 'https://www.ti.com/product/TCAN330', price1k: 0.65 }] },
  { competitor: 'PCA9685', manufacturer: 'NXP', category: 'LED Drivers', tiParts: [{ part: 'TLC5940', description: '16-Channel LED Driver with PWM', url: 'https://www.ti.com/product/TLC5940', price1k: 2.10 }] },

  // --- Infineon / Cypress ---
  { competitor: 'IRF540N', manufacturer: 'Infineon', category: 'Power MOSFETs', tiParts: [{ part: 'CSD19536KCS', description: '100V, N-Channel NexFET Power MOSFET', url: 'https://www.ti.com/product/CSD19536KCS', price1k: 0.89 }] },
  { competitor: 'IR2110', manufacturer: 'Infineon', category: 'Gate Drivers', tiParts: [{ part: 'UCC27211', description: '120V Half-Bridge Gate Driver', url: 'https://www.ti.com/product/UCC27211', price1k: 1.55 }] },
  { competitor: 'IR2104', manufacturer: 'Infineon', category: 'Gate Drivers', tiParts: [{ part: 'UCC27201', description: '120V Half-Bridge Gate Driver', url: 'https://www.ti.com/product/UCC27201', price1k: 1.30 }] },
  { competitor: 'IRS2092', manufacturer: 'Infineon', category: 'Audio', tiParts: [{ part: 'TPA3255', description: '315W Stereo Class-D Audio Amplifier', url: 'https://www.ti.com/product/TPA3255', price1k: 5.25 }] },
  { competitor: 'PSoC 6', manufacturer: 'Infineon', category: 'MCU', tiParts: [{ part: 'CC2652R', description: 'SimpleLink Multiprotocol Wireless MCU', url: 'https://www.ti.com/product/CC2652R', price1k: 3.40 }] },

  // --- ON Semiconductor / onsemi ---
  { competitor: 'NCP1117', manufacturer: 'onsemi', category: 'Power Management', tiParts: [{ part: 'TLV1117', description: '800mA, Low-Dropout Regulator', url: 'https://www.ti.com/product/TLV1117', price1k: 0.38 }] },
  { competitor: 'NCV7356', manufacturer: 'onsemi', category: 'Interface', tiParts: [{ part: 'TCAN4550', description: 'CAN FD Controller with Transceiver', url: 'https://www.ti.com/product/TCAN4550', price1k: 2.85 }] },
  { competitor: 'NCS20071', manufacturer: 'onsemi', category: 'Amplifiers', tiParts: [{ part: 'TLV9001', description: 'Single, 1MHz, RRIO Op Amp', url: 'https://www.ti.com/product/TLV9001', price1k: 0.25 }] },
  { competitor: 'FAN7530', manufacturer: 'onsemi', category: 'Power Management', tiParts: [{ part: 'UCC28180', description: 'PFC Controller', url: 'https://www.ti.com/product/UCC28180', price1k: 1.60 }] },

  // --- Maxim (now part of ADI) ---
  { competitor: 'MAX232', manufacturer: 'Maxim', category: 'Interface', tiParts: [{ part: 'MAX232', description: 'Dual RS-232 Driver/Receiver', url: 'https://www.ti.com/product/MAX232', price1k: 0.95 }] },
  { competitor: 'MAX485', manufacturer: 'Maxim', category: 'Interface', tiParts: [{ part: 'SN65HVD72', description: 'RS-485 Transceiver', url: 'https://www.ti.com/product/SN65HVD72', price1k: 1.10 }] },
  { competitor: 'MAX6675', manufacturer: 'Maxim', category: 'Data Converters', tiParts: [{ part: 'ADS1118', description: '16-Bit ADC with Thermocouple Support', url: 'https://www.ti.com/product/ADS1118', price1k: 3.50 }] },
  { competitor: 'DS18B20', manufacturer: 'Maxim', category: 'Sensors', tiParts: [{ part: 'TMP117', description: 'High-Accuracy Digital Temperature Sensor', url: 'https://www.ti.com/product/TMP117', price1k: 1.85 }] },
  { competitor: 'MAX17048', manufacturer: 'Maxim', category: 'Power Management', tiParts: [{ part: 'BQ27441', description: 'Battery Fuel Gauge', url: 'https://www.ti.com/product/BQ27441-G1', price1k: 1.95 }] },

  // --- Renesas ---
  { competitor: 'ISL8117', manufacturer: 'Renesas', category: 'Power Management', tiParts: [{ part: 'TPS54560', description: '5A, 60V Step-Down Converter', url: 'https://www.ti.com/product/TPS54560', price1k: 2.10 }] },
  { competitor: 'RX65N', manufacturer: 'Renesas', category: 'MCU', tiParts: [{ part: 'TM4C1294NCPDT', description: '32-Bit ARM Cortex-M4F MCU', url: 'https://www.ti.com/product/TM4C1294NCPDT', price1k: 9.95 }] },
  { competitor: 'RA6M4', manufacturer: 'Renesas', category: 'MCU', tiParts: [{ part: 'MSPM0G3507', description: 'Arm Cortex-M0+ MCU', url: 'https://www.ti.com/product/MSPM0G3507', price1k: 1.10 }] },

  // --- Qualcomm ---
  { competitor: 'QCA7000', manufacturer: 'Qualcomm', category: 'Communication', tiParts: [{ part: 'DP83867', description: 'Gigabit Ethernet PHY', url: 'https://www.ti.com/product/DP83867', price1k: 2.75 }] },

  // --- FTDI ---
  { competitor: 'FT232R', manufacturer: 'FTDI', category: 'Interface', tiParts: [{ part: 'TUSB3410', description: 'USB to UART Bridge Controller', url: 'https://www.ti.com/product/TUSB3410', price1k: 2.30 }] },
  { competitor: 'FT2232H', manufacturer: 'FTDI', category: 'Interface', tiParts: [{ part: 'TUSB8041', description: 'USB Hub Controller', url: 'https://www.ti.com/product/TUSB8041', price1k: 3.10 }] },

  // --- Silicon Labs ---
  { competitor: 'CP2102', manufacturer: 'Silicon Labs', category: 'Interface', tiParts: [{ part: 'TUSB3410', description: 'USB to UART Bridge', url: 'https://www.ti.com/product/TUSB3410', price1k: 2.30 }] },
  { competitor: 'EFM32', manufacturer: 'Silicon Labs', category: 'MCU', tiParts: [{ part: 'MSP430FR5969', description: '16-Bit, Ultra-Low-Power FRAM MCU', url: 'https://www.ti.com/product/MSP430FR5969', price1k: 2.50 }] },
  { competitor: 'Si7021', manufacturer: 'Silicon Labs', category: 'Sensors', tiParts: [{ part: 'HDC2080', description: 'Low-Power Humidity & Temperature Sensor', url: 'https://www.ti.com/product/HDC2080', price1k: 1.40 }] },

  // --- Vishay ---
  { competitor: 'TCPT1300', manufacturer: 'Vishay', category: 'Sensors', tiParts: [{ part: 'OPT3002', description: 'Light-to-Digital Sensor', url: 'https://www.ti.com/product/OPT3002', price1k: 0.95 }] },

  // --- Bosch ---
  { competitor: 'BMP280', manufacturer: 'Bosch', category: 'Sensors', tiParts: [{ part: 'DRV5032', description: 'Ultra-Low-Power Hall Effect Sensor', url: 'https://www.ti.com/product/DRV5032', price1k: 0.45 }] },
  { competitor: 'BME280', manufacturer: 'Bosch', category: 'Sensors', tiParts: [{ part: 'HDC2080', description: 'Humidity & Temperature Sensor', url: 'https://www.ti.com/product/HDC2080', price1k: 1.40 }] },

  // --- Espressif ---
  { competitor: 'ESP32', manufacturer: 'Espressif', category: 'MCU / Wireless', tiParts: [{ part: 'CC3235S', description: 'SimpleLink Wi-Fi Dual-Band MCU', url: 'https://www.ti.com/product/CC3235S', price1k: 5.90 }] },
  { competitor: 'ESP8266', manufacturer: 'Espressif', category: 'MCU / Wireless', tiParts: [{ part: 'CC3120', description: 'SimpleLink Wi-Fi Network Processor', url: 'https://www.ti.com/product/CC3120', price1k: 4.50 }] },

  // --- Nordic ---
  { competitor: 'nRF52832', manufacturer: 'Nordic', category: 'MCU / Wireless', tiParts: [{ part: 'CC2652R', description: 'SimpleLink Multiprotocol Wireless MCU', url: 'https://www.ti.com/product/CC2652R', price1k: 3.40 }] },
  { competitor: 'nRF52840', manufacturer: 'Nordic', category: 'MCU / Wireless', tiParts: [{ part: 'CC2652P', description: 'Multiprotocol Wireless MCU with PA', url: 'https://www.ti.com/product/CC2652P', price1k: 3.95 }] },
  { competitor: 'nRF5340', manufacturer: 'Nordic', category: 'MCU / Wireless', tiParts: [{ part: 'CC2674R10', description: 'Multiprotocol Wireless MCU', url: 'https://www.ti.com/product/CC2674R10', price1k: 4.20 }] },
  { competitor: 'nRF9160', manufacturer: 'Nordic', category: 'MCU / Wireless', tiParts: [{ part: 'CC1352P', description: 'SimpleLink Sub-1GHz & BLE MCU', url: 'https://www.ti.com/product/CC1352P', price1k: 4.85 }] },

  // --- Additional Analog Devices ---
  { competitor: 'AD8232', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'ADS1292R', description: 'Low-Power 2-Channel AFE for ECG', url: 'https://www.ti.com/product/ADS1292R', price1k: 6.50 }] },
  { competitor: 'AD8495', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'LMP90100', description: 'Sensor AFE with Thermocouple Support', url: 'https://www.ti.com/product/LMP90100', price1k: 3.80 }] },
  { competitor: 'AD5933', manufacturer: 'Analog Devices', category: 'Data Converters', tiParts: [{ part: 'AFE4300', description: 'Impedance & Body Composition AFE', url: 'https://www.ti.com/product/AFE4300', price1k: 4.50 }] },
  { competitor: 'AD7793', manufacturer: 'Analog Devices', category: 'Data Converters', tiParts: [{ part: 'ADS1220', description: '24-Bit, Low-Power Delta-Sigma ADC', url: 'https://www.ti.com/product/ADS1220', price1k: 2.95 }] },
  { competitor: 'AD8542', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'TLV2372', description: 'Dual, Rail-to-Rail Op Amp', url: 'https://www.ti.com/product/TLV2372', price1k: 0.65 }] },
  { competitor: 'AD7991', manufacturer: 'Analog Devices', category: 'Data Converters', tiParts: [{ part: 'ADS1015', description: '12-Bit, 4-Channel I2C ADC', url: 'https://www.ti.com/product/ADS1015', price1k: 1.50 }] },
  { competitor: 'AD5246', manufacturer: 'Analog Devices', category: 'Data Converters', tiParts: [{ part: 'TPL0501', description: '256-Tap Digital Potentiometer', url: 'https://www.ti.com/product/TPL0501', price1k: 0.85 }] },
  { competitor: 'ADA4084', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'OPA2376', description: 'Dual, Low-Noise, Low-Quiescent Op Amp', url: 'https://www.ti.com/product/OPA2376', price1k: 1.35 }] },
  { competitor: 'AD8476', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'THS4551', description: 'Low-Noise, Fully Differential Amplifier', url: 'https://www.ti.com/product/THS4551', price1k: 1.75 }] },
  { competitor: 'AD8137', manufacturer: 'Analog Devices', category: 'Amplifiers', tiParts: [{ part: 'THS4521', description: 'Low-Power Fully Differential Amplifier', url: 'https://www.ti.com/product/THS4521', price1k: 1.25 }] },
  { competitor: 'ADP5054', manufacturer: 'Analog Devices', category: 'Power Management', tiParts: [{ part: 'TPS65263', description: 'Triple Output Step-Down Converter', url: 'https://www.ti.com/product/TPS65263', price1k: 3.20 }] },
  { competitor: 'ADP7118', manufacturer: 'Analog Devices', category: 'Power Management', tiParts: [{ part: 'TPS7A47', description: '1A, Low-Noise LDO Regulator', url: 'https://www.ti.com/product/TPS7A47', price1k: 0.85 }] },
  { competitor: 'AD5761', manufacturer: 'Analog Devices', category: 'Data Converters', tiParts: [{ part: 'DAC8760', description: '16-Bit, Voltage/Current Output DAC', url: 'https://www.ti.com/product/DAC8760', price1k: 5.50 }] },
  { competitor: 'AD7616', manufacturer: 'Analog Devices', category: 'Data Converters', tiParts: [{ part: 'ADS8584S', description: '16-Bit, 4-Channel Simultaneous SAR ADC', url: 'https://www.ti.com/product/ADS8584S', price1k: 12.50 }] },
  { competitor: 'ADUM1201', manufacturer: 'Analog Devices', category: 'Isolation', tiParts: [{ part: 'ISO7721', description: 'Dual-Channel Digital Isolator', url: 'https://www.ti.com/product/ISO7721', price1k: 0.95 }] },
  { competitor: 'ADUM3160', manufacturer: 'Analog Devices', category: 'Isolation', tiParts: [{ part: 'ISOUSB211', description: 'USB 2.0 Digital Isolator', url: 'https://www.ti.com/product/ISOUSB211', price1k: 3.25 }] },
  { competitor: 'ADUM4160', manufacturer: 'Analog Devices', category: 'Isolation', tiParts: [{ part: 'ISOUSB111', description: 'USB Digital Isolator', url: 'https://www.ti.com/product/ISOUSB111', price1k: 2.90 }] },
  { competitor: 'ADM2587E', manufacturer: 'Analog Devices', category: 'Interface', tiParts: [{ part: 'ISO1450', description: 'Isolated RS-485 Transceiver', url: 'https://www.ti.com/product/ISO1450', price1k: 3.50 }] },
  { competitor: 'ADR4525', manufacturer: 'Analog Devices', category: 'Voltage References', tiParts: [{ part: 'REF5025', description: '2.5V, Low-Noise Voltage Reference', url: 'https://www.ti.com/product/REF5025', price1k: 2.80 }] },
  { competitor: 'ADR431', manufacturer: 'Analog Devices', category: 'Voltage References', tiParts: [{ part: 'REF3025', description: '2.5V Precision Voltage Reference', url: 'https://www.ti.com/product/REF3025', price1k: 1.20 }] },

  // --- Additional STMicroelectronics ---
  { competitor: 'STM32G431', manufacturer: 'STMicroelectronics', category: 'MCU', tiParts: [{ part: 'MSPM0G3507', description: 'Arm Cortex-M0+ MCU with Motor Control', url: 'https://www.ti.com/product/MSPM0G3507', price1k: 1.10 }] },
  { competitor: 'STM32F030', manufacturer: 'STMicroelectronics', category: 'MCU', tiParts: [{ part: 'MSP430FR2311', description: '16-Bit, Value-Line FRAM MCU', url: 'https://www.ti.com/product/MSP430FR2311', price1k: 0.59 }] },
  { competitor: 'STM32L053', manufacturer: 'STMicroelectronics', category: 'MCU', tiParts: [{ part: 'MSP430FR5969', description: '16-Bit, Ultra-Low-Power FRAM MCU', url: 'https://www.ti.com/product/MSP430FR5969', price1k: 2.50 }] },
  { competitor: 'STM32F429', manufacturer: 'STMicroelectronics', category: 'MCU', tiParts: [{ part: 'AM2434', description: 'Sitara ARM Cortex-R5F Processor', url: 'https://www.ti.com/product/AM2434', price1k: 16.50 }] },
  { competitor: 'STM32WB55', manufacturer: 'STMicroelectronics', category: 'MCU / Wireless', tiParts: [{ part: 'CC2652R7', description: 'SimpleLink Multiprotocol Wireless MCU', url: 'https://www.ti.com/product/CC2652R7', price1k: 3.75 }] },
  { competitor: 'STM32MP157', manufacturer: 'STMicroelectronics', category: 'Processors', tiParts: [{ part: 'AM625', description: 'Sitara ARM Cortex-A53 Processor', url: 'https://www.ti.com/product/AM625', price1k: 9.00 }] },
  { competitor: 'L6234', manufacturer: 'STMicroelectronics', category: 'Motor Drivers', tiParts: [{ part: 'DRV8313', description: 'Triple Half-Bridge Motor Driver', url: 'https://www.ti.com/product/DRV8313', price1k: 2.25 }] },
  { competitor: 'L6470', manufacturer: 'STMicroelectronics', category: 'Motor Drivers', tiParts: [{ part: 'DRV8825', description: 'Stepper Motor Driver with Microstepping', url: 'https://www.ti.com/product/DRV8825', price1k: 1.85 }] },
  { competitor: 'STSPIN820', manufacturer: 'STMicroelectronics', category: 'Motor Drivers', tiParts: [{ part: 'DRV8837', description: '1.8A Low-Voltage H-Bridge Driver', url: 'https://www.ti.com/product/DRV8837', price1k: 0.65 }] },
  { competitor: 'L6599', manufacturer: 'STMicroelectronics', category: 'Power Management', tiParts: [{ part: 'UCC25600', description: 'LLC Resonant Half-Bridge Controller', url: 'https://www.ti.com/product/UCC25600', price1k: 1.40 }] },
  { competitor: 'ST1S10', manufacturer: 'STMicroelectronics', category: 'Power Management', tiParts: [{ part: 'TPS54340', description: '3.5A, 42V Step-Down Converter', url: 'https://www.ti.com/product/TPS54340', price1k: 1.30 }] },
  { competitor: 'STUSB4500', manufacturer: 'STMicroelectronics', category: 'Interface', tiParts: [{ part: 'TPS25750', description: 'USB Type-C & PD Controller', url: 'https://www.ti.com/product/TPS25750', price1k: 3.50 }] },

  // --- Additional NXP ---
  { competitor: 'LPC55S69', manufacturer: 'NXP', category: 'MCU', tiParts: [{ part: 'MSP432E411Y', description: '32-Bit ARM Cortex-M4F MCU with Ethernet', url: 'https://www.ti.com/product/MSP432E411Y', price1k: 7.50 }] },
  { competitor: 'S32K144', manufacturer: 'NXP', category: 'MCU', tiParts: [{ part: 'TMS320F28379D', description: 'C2000 Dual-Core MCU for Motor Control', url: 'https://www.ti.com/product/TMS320F28379D', price1k: 11.50 }] },
  { competitor: 'i.MX RT1060', manufacturer: 'NXP', category: 'Processors', tiParts: [{ part: 'AM2431', description: 'Sitara ARM Cortex-R5F Real-Time Processor', url: 'https://www.ti.com/product/AM2431', price1k: 8.50 }] },
  { competitor: 'TJA1145', manufacturer: 'NXP', category: 'Interface', tiParts: [{ part: 'TCAN1145', description: 'CAN FD Transceiver with Sleep', url: 'https://www.ti.com/product/TCAN1145', price1k: 1.45 }] },
  { competitor: 'TJA1044', manufacturer: 'NXP', category: 'Interface', tiParts: [{ part: 'TCAN332', description: '3.3V CAN Transceiver', url: 'https://www.ti.com/product/TCAN332', price1k: 0.55 }] },
  { competitor: 'PCA9548A', manufacturer: 'NXP', category: 'Interface', tiParts: [{ part: 'TCA9548A', description: '8-Channel I2C Multiplexer', url: 'https://www.ti.com/product/TCA9548A', price1k: 1.15 }] },
  { competitor: 'PCA9555', manufacturer: 'NXP', category: 'Interface', tiParts: [{ part: 'TCA6416A', description: '16-Bit I2C GPIO Expander', url: 'https://www.ti.com/product/TCA6416A', price1k: 1.25 }] },
  { competitor: 'PCA9306', manufacturer: 'NXP', category: 'Interface', tiParts: [{ part: 'TXB0102', description: '2-Bit Bidirectional Voltage Translator', url: 'https://www.ti.com/product/TXB0102', price1k: 0.45 }] },
  { competitor: 'PCF8574', manufacturer: 'NXP', category: 'Interface', tiParts: [{ part: 'TCA6408A', description: '8-Bit I2C GPIO Expander', url: 'https://www.ti.com/product/TCA6408A', price1k: 0.85 }] },
  { competitor: 'NTB0104', manufacturer: 'NXP', category: 'Logic', tiParts: [{ part: 'TXB0104', description: '4-Bit Bidirectional Voltage Translator', url: 'https://www.ti.com/product/TXB0104', price1k: 0.55 }] },

  // --- Additional Infineon ---
  { competitor: 'IFX9201', manufacturer: 'Infineon', category: 'Motor Drivers', tiParts: [{ part: 'DRV8870', description: '3.6A H-Bridge Motor Driver', url: 'https://www.ti.com/product/DRV8870', price1k: 1.10 }] },
  { competitor: 'TLE9201', manufacturer: 'Infineon', category: 'Motor Drivers', tiParts: [{ part: 'DRV8873', description: '10A H-Bridge Motor Driver', url: 'https://www.ti.com/product/DRV8873', price1k: 2.50 }] },
  { competitor: 'TLV493D', manufacturer: 'Infineon', category: 'Sensors', tiParts: [{ part: 'TMAG5273', description: '3D Hall-Effect Sensor', url: 'https://www.ti.com/product/TMAG5273', price1k: 0.75 }] },
  { competitor: 'TLE4998', manufacturer: 'Infineon', category: 'Sensors', tiParts: [{ part: 'TMAG5170', description: 'High-Precision Linear Hall Sensor', url: 'https://www.ti.com/product/TMAG5170', price1k: 1.60 }] },
  { competitor: 'ICE5QR4770AZ', manufacturer: 'Infineon', category: 'Power Management', tiParts: [{ part: 'UCC28740', description: 'Flyback Controller for USB PD', url: 'https://www.ti.com/product/UCC28740', price1k: 0.95 }] },
  { competitor: 'IR3550', manufacturer: 'Infineon', category: 'Power Management', tiParts: [{ part: 'TPS53515', description: '15A Synchronous Step-Down Converter', url: 'https://www.ti.com/product/TPS53515', price1k: 2.80 }] },
  { competitor: 'BTS7960', manufacturer: 'Infineon', category: 'Motor Drivers', tiParts: [{ part: 'DRV8701', description: 'Motor Driver with FET Control', url: 'https://www.ti.com/product/DRV8701', price1k: 1.85 }] },

  // --- Additional Microchip ---
  { competitor: 'ATSAMV71', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'TMS570LS1227', description: 'ARM Cortex-R4F Safety MCU', url: 'https://www.ti.com/product/TMS570LS1227', price1k: 12.00 }] },
  { competitor: 'ATSAME54', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'MSP432P4111', description: '32-Bit, ARM Cortex-M4F MCU', url: 'https://www.ti.com/product/MSP432P4111', price1k: 5.25 }] },
  { competitor: 'PIC18F46K22', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'MSP430FR2475', description: '16-Bit FRAM MCU with LCD', url: 'https://www.ti.com/product/MSP430FR2475', price1k: 1.35 }] },
  { competitor: 'dsPIC33CK', manufacturer: 'Microchip', category: 'MCU', tiParts: [{ part: 'TMS320F280049', description: 'C2000 Real-Time Control MCU', url: 'https://www.ti.com/product/TMS320F280049', price1k: 4.50 }] },
  { competitor: 'MCP2562', manufacturer: 'Microchip', category: 'Interface', tiParts: [{ part: 'TCAN332', description: '3.3V CAN Transceiver', url: 'https://www.ti.com/product/TCAN332', price1k: 0.55 }] },
  { competitor: 'MCP2551', manufacturer: 'Microchip', category: 'Interface', tiParts: [{ part: 'SN65HVD230', description: '3.3V CAN Transceiver', url: 'https://www.ti.com/product/SN65HVD230', price1k: 0.70 }] },
  { competitor: 'MCP23017', manufacturer: 'Microchip', category: 'Interface', tiParts: [{ part: 'TCA6416A', description: '16-Bit I2C GPIO Expander', url: 'https://www.ti.com/product/TCA6416A', price1k: 1.25 }] },
  { competitor: 'MCP1700', manufacturer: 'Microchip', category: 'Power Management', tiParts: [{ part: 'TLV702', description: '300mA, Low-IQ LDO Regulator', url: 'https://www.ti.com/product/TLV702', price1k: 0.22 }] },
  { competitor: 'MCP1826', manufacturer: 'Microchip', category: 'Power Management', tiParts: [{ part: 'TLV1117LV', description: '1A Low-Dropout Regulator', url: 'https://www.ti.com/product/TLV1117LV', price1k: 0.30 }] },
  { competitor: 'MCP73831', manufacturer: 'Microchip', category: 'Power Management', tiParts: [{ part: 'BQ21040', description: 'Single-Cell Li-Ion Charger', url: 'https://www.ti.com/product/BQ21040', price1k: 0.65 }] },
  { competitor: 'MCP3208', manufacturer: 'Microchip', category: 'Data Converters', tiParts: [{ part: 'ADS7953', description: '12-Bit, 16-Channel SAR ADC', url: 'https://www.ti.com/product/ADS7953', price1k: 3.90 }] },
  { competitor: 'MCP4922', manufacturer: 'Microchip', category: 'Data Converters', tiParts: [{ part: 'DAC8552', description: '16-Bit, Dual-Channel SPI DAC', url: 'https://www.ti.com/product/DAC8552', price1k: 3.50 }] },

  // --- Additional onsemi ---
  { competitor: 'NCV8664', manufacturer: 'onsemi', category: 'Power Management', tiParts: [{ part: 'TPS7B68', description: 'Automotive 150mA LDO', url: 'https://www.ti.com/product/TPS7B68', price1k: 0.40 }] },
  { competitor: 'NCP186', manufacturer: 'onsemi', category: 'Power Management', tiParts: [{ part: 'TPS7A02', description: '200mA, Ultra-Low-IQ LDO', url: 'https://www.ti.com/product/TPS7A02', price1k: 0.35 }] },
  { competitor: 'NCP164', manufacturer: 'onsemi', category: 'Power Management', tiParts: [{ part: 'TLV733P', description: '300mA Low-Dropout Regulator', url: 'https://www.ti.com/product/TLV733P', price1k: 0.18 }] },
  { competitor: 'NCP3170', manufacturer: 'onsemi', category: 'Power Management', tiParts: [{ part: 'TPS562200', description: '2A, 17V Step-Down Converter', url: 'https://www.ti.com/product/TPS562200', price1k: 0.45 }] },
  { competitor: 'FAN3852', manufacturer: 'onsemi', category: 'Power Management', tiParts: [{ part: 'TPS62160', description: '1A, 3-17V Step-Down Converter', url: 'https://www.ti.com/product/TPS62160', price1k: 0.95 }] },
  { competitor: 'NCV7430', manufacturer: 'onsemi', category: 'Interface', tiParts: [{ part: 'DP83TC812', description: 'Automotive Ethernet PHY', url: 'https://www.ti.com/product/DP83TC812', price1k: 3.80 }] },

  // --- Additional Maxim ---
  { competitor: 'MAX3232', manufacturer: 'Maxim', category: 'Interface', tiParts: [{ part: 'MAX3232', description: '3V-5.5V RS-232 Transceiver', url: 'https://www.ti.com/product/MAX3232', price1k: 1.10 }] },
  { competitor: 'MAX3485', manufacturer: 'Maxim', category: 'Interface', tiParts: [{ part: 'SN65HVD75', description: '3.3V RS-485 Transceiver', url: 'https://www.ti.com/product/SN65HVD75', price1k: 0.90 }] },
  { competitor: 'MAX31855', manufacturer: 'Maxim', category: 'Data Converters', tiParts: [{ part: 'ADS1118', description: '16-Bit ADC with Thermocouple', url: 'https://www.ti.com/product/ADS1118', price1k: 3.50 }] },
  { competitor: 'MAX31865', manufacturer: 'Maxim', category: 'Data Converters', tiParts: [{ part: 'ADS1247', description: '24-Bit, Delta-Sigma ADC for RTD', url: 'https://www.ti.com/product/ADS1247', price1k: 4.25 }] },
  { competitor: 'MAX9814', manufacturer: 'Maxim', category: 'Amplifiers', tiParts: [{ part: 'OPA344', description: 'Rail-to-Rail Op Amp for Microphones', url: 'https://www.ti.com/product/OPA344', price1k: 0.85 }] },
  { competitor: 'MAX98357A', manufacturer: 'Maxim', category: 'Audio', tiParts: [{ part: 'TAS2563', description: 'Digital Input Class-D Audio Amplifier', url: 'https://www.ti.com/product/TAS2563', price1k: 1.95 }] },
  { competitor: 'MAX9926', manufacturer: 'Maxim', category: 'Sensors', tiParts: [{ part: 'LM1815', description: 'Variable Reluctance Sensor Interface', url: 'https://www.ti.com/product/LM1815', price1k: 2.30 }] },
  { competitor: 'DS3231', manufacturer: 'Maxim', category: 'Clock & Timing', tiParts: [{ part: 'BQ32000', description: 'Real-Time Clock with Trickle Charger', url: 'https://www.ti.com/product/BQ32000', price1k: 1.60 }] },
  { competitor: 'DS1307', manufacturer: 'Maxim', category: 'Clock & Timing', tiParts: [{ part: 'BQ32000', description: 'Real-Time Clock', url: 'https://www.ti.com/product/BQ32000', price1k: 1.60 }] },
  { competitor: 'MAX7219', manufacturer: 'Maxim', category: 'LED Drivers', tiParts: [{ part: 'TLC5928', description: '16-Channel LED Driver', url: 'https://www.ti.com/product/TLC5928', price1k: 1.75 }] },

  // --- Additional Renesas ---
  { competitor: 'ISL28022', manufacturer: 'Renesas', category: 'Power Management', tiParts: [{ part: 'INA226', description: 'High-Side Digital Power Monitor', url: 'https://www.ti.com/product/INA226', price1k: 1.95 }] },
  { competitor: 'ISL29023', manufacturer: 'Renesas', category: 'Sensors', tiParts: [{ part: 'OPT3001', description: 'Ambient Light Sensor', url: 'https://www.ti.com/product/OPT3001', price1k: 0.85 }] },
  { competitor: 'RAA211850', manufacturer: 'Renesas', category: 'Power Management', tiParts: [{ part: 'TPS543620', description: '6A Synchronous Step-Down Converter', url: 'https://www.ti.com/product/TPS543620', price1k: 1.40 }] },
  { competitor: 'R5F100LE', manufacturer: 'Renesas', category: 'MCU', tiParts: [{ part: 'MSP430FR2433', description: '16-Bit, FRAM MCU', url: 'https://www.ti.com/product/MSP430FR2433', price1k: 0.89 }] },
  { competitor: 'RA4M1', manufacturer: 'Renesas', category: 'MCU', tiParts: [{ part: 'MSPM0L1306', description: 'Arm Cortex-M0+ Value MCU', url: 'https://www.ti.com/product/MSPM0L1306', price1k: 0.45 }] },

  // --- Additional Silicon Labs ---
  { competitor: 'EFR32BG22', manufacturer: 'Silicon Labs', category: 'MCU / Wireless', tiParts: [{ part: 'CC2340R5', description: 'SimpleLink BLE 5.3 MCU', url: 'https://www.ti.com/product/CC2340R5', price1k: 1.45 }] },
  { competitor: 'EFR32MG21', manufacturer: 'Silicon Labs', category: 'MCU / Wireless', tiParts: [{ part: 'CC2652R7', description: 'Multiprotocol Zigbee/Thread MCU', url: 'https://www.ti.com/product/CC2652R7', price1k: 3.75 }] },
  { competitor: 'Si4463', manufacturer: 'Silicon Labs', category: 'RF & Wireless', tiParts: [{ part: 'CC1200', description: 'Low-Power Sub-1GHz RF Transceiver', url: 'https://www.ti.com/product/CC1200', price1k: 3.20 }] },
  { competitor: 'Si1145', manufacturer: 'Silicon Labs', category: 'Sensors', tiParts: [{ part: 'OPT3006', description: 'Ambient Light & UV Sensor', url: 'https://www.ti.com/product/OPT3006', price1k: 0.70 }] },
  { competitor: 'CP2104', manufacturer: 'Silicon Labs', category: 'Interface', tiParts: [{ part: 'TUSB3410', description: 'USB to UART Bridge', url: 'https://www.ti.com/product/TUSB3410', price1k: 2.30 }] },

  // --- Additional Espressif ---
  { competitor: 'ESP32-S3', manufacturer: 'Espressif', category: 'MCU / Wireless', tiParts: [{ part: 'CC3235S', description: 'SimpleLink Wi-Fi Dual-Band MCU', url: 'https://www.ti.com/product/CC3235S', price1k: 5.90 }] },
  { competitor: 'ESP32-C3', manufacturer: 'Espressif', category: 'MCU / Wireless', tiParts: [{ part: 'CC2340R5', description: 'SimpleLink BLE MCU with Wi-Fi', url: 'https://www.ti.com/product/CC2340R5', price1k: 1.45 }] },
  { competitor: 'ESP32-C6', manufacturer: 'Espressif', category: 'MCU / Wireless', tiParts: [{ part: 'CC2674R10', description: 'Multiprotocol MCU with Thread/Zigbee', url: 'https://www.ti.com/product/CC2674R10', price1k: 4.20 }] },

  // --- Additional FTDI ---
  { competitor: 'FT4232H', manufacturer: 'FTDI', category: 'Interface', tiParts: [{ part: 'TUSB8041', description: '4-Port USB Hub Controller', url: 'https://www.ti.com/product/TUSB8041', price1k: 3.10 }] },
  { competitor: 'FT260', manufacturer: 'FTDI', category: 'Interface', tiParts: [{ part: 'TUSB3410', description: 'USB to UART/I2C Bridge', url: 'https://www.ti.com/product/TUSB3410', price1k: 2.30 }] },

  // --- Rohm ---
  { competitor: 'BD9G341', manufacturer: 'Rohm', category: 'Power Management', tiParts: [{ part: 'LMR14030', description: '3.5A, 40V Step-Down Converter', url: 'https://www.ti.com/product/LMR14030', price1k: 0.95 }] },
  { competitor: 'BM1390GLV', manufacturer: 'Rohm', category: 'Sensors', tiParts: [{ part: 'HDC3020', description: 'High-Accuracy Humidity & Temp Sensor', url: 'https://www.ti.com/product/HDC3020', price1k: 1.80 }] },
  { competitor: 'BD63150', manufacturer: 'Rohm', category: 'Motor Drivers', tiParts: [{ part: 'DRV8876', description: '3.5A H-Bridge Motor Driver', url: 'https://www.ti.com/product/DRV8876', price1k: 1.20 }] },

  // --- Allegro ---
  { competitor: 'ACS712', manufacturer: 'Allegro', category: 'Sensors', tiParts: [{ part: 'TMCS1100', description: 'Hall-Effect Current Sensor', url: 'https://www.ti.com/product/TMCS1100', price1k: 2.10 }] },
  { competitor: 'ACS758', manufacturer: 'Allegro', category: 'Sensors', tiParts: [{ part: 'TMCS1108', description: 'High-Accuracy Hall Current Sensor', url: 'https://www.ti.com/product/TMCS1108', price1k: 2.45 }] },
  { competitor: 'A1332', manufacturer: 'Allegro', category: 'Sensors', tiParts: [{ part: 'TMAG5170', description: '12-Bit Angle Sensor', url: 'https://www.ti.com/product/TMAG5170', price1k: 1.60 }] },
  { competitor: 'A4953', manufacturer: 'Allegro', category: 'Motor Drivers', tiParts: [{ part: 'DRV8876', description: '3.5A H-Bridge Motor Driver', url: 'https://www.ti.com/product/DRV8876', price1k: 1.20 }] },

  // --- Diodes Inc ---
  { competitor: 'AP2112', manufacturer: 'Diodes Inc', category: 'Power Management', tiParts: [{ part: 'TLV702', description: '300mA, Low-IQ LDO', url: 'https://www.ti.com/product/TLV702', price1k: 0.22 }] },
  { competitor: 'AP3418', manufacturer: 'Diodes Inc', category: 'Power Management', tiParts: [{ part: 'TPS562200', description: '2A Step-Down Converter', url: 'https://www.ti.com/product/TPS562200', price1k: 0.45 }] },
  { competitor: 'PAM8403', manufacturer: 'Diodes Inc', category: 'Audio', tiParts: [{ part: 'TPA2012D2', description: '2.1W Stereo Class-D Amplifier', url: 'https://www.ti.com/product/TPA2012D2', price1k: 0.95 }] },

  // --- Torex ---
  { competitor: 'XC6206', manufacturer: 'Torex', category: 'Power Management', tiParts: [{ part: 'TLV702', description: '300mA, Low-Dropout Regulator', url: 'https://www.ti.com/product/TLV702', price1k: 0.22 }] },
  { competitor: 'XC9265', manufacturer: 'Torex', category: 'Power Management', tiParts: [{ part: 'TPS62840', description: '750nA IQ Step-Down Converter', url: 'https://www.ti.com/product/TPS62840', price1k: 0.95 }] },

  // --- Monolithic Power Systems (MPS) ---
  { competitor: 'MP2359', manufacturer: 'MPS', category: 'Power Management', tiParts: [{ part: 'TPS54302', description: '3A, 28V Step-Down Converter', url: 'https://www.ti.com/product/TPS54302', price1k: 0.73 }] },
  { competitor: 'MP1584', manufacturer: 'MPS', category: 'Power Management', tiParts: [{ part: 'TPS54560', description: '5A, 60V Step-Down Converter', url: 'https://www.ti.com/product/TPS54560', price1k: 2.10 }] },
  { competitor: 'MP2307', manufacturer: 'MPS', category: 'Power Management', tiParts: [{ part: 'LMR14030', description: '3A, 40V Step-Down Converter', url: 'https://www.ti.com/product/LMR14030', price1k: 0.95 }] },
  { competitor: 'MPM3610', manufacturer: 'MPS', category: 'Power Management', tiParts: [{ part: 'TPSM53604', description: '4A Power Module', url: 'https://www.ti.com/product/TPSM53604', price1k: 3.50 }] },
  { competitor: 'MP8859', manufacturer: 'MPS', category: 'Power Management', tiParts: [{ part: 'TPS61088', description: '10A Boost Converter', url: 'https://www.ti.com/product/TPS61088', price1k: 2.75 }] },

  // --- Semtech ---
  { competitor: 'SX1276', manufacturer: 'Semtech', category: 'RF & Wireless', tiParts: [{ part: 'CC1312R', description: 'Sub-1GHz Wireless MCU', url: 'https://www.ti.com/product/CC1312R', price1k: 3.95 }] },
  { competitor: 'SX1262', manufacturer: 'Semtech', category: 'RF & Wireless', tiParts: [{ part: 'CC1352P', description: 'Multi-Band Wireless MCU', url: 'https://www.ti.com/product/CC1352P', price1k: 4.85 }] },

  // --- Lattice ---
  { competitor: 'iCE40UP5K', manufacturer: 'Lattice', category: 'FPGA', tiParts: [{ part: 'MSPM0G3507', description: 'Arm Cortex-M0+ with Smart Peripherals', url: 'https://www.ti.com/product/MSPM0G3507', price1k: 1.10 }] },

  // --- Broadcom / Avago ---
  { competitor: 'ACPL-072L', manufacturer: 'Broadcom', category: 'Isolation', tiParts: [{ part: 'ISO5852S', description: 'Isolated Gate Driver', url: 'https://www.ti.com/product/ISO5852S', price1k: 2.80 }] },
  { competitor: 'HCPL-3120', manufacturer: 'Broadcom', category: 'Isolation', tiParts: [{ part: 'UCC21520', description: 'Isolated Dual-Channel Gate Driver', url: 'https://www.ti.com/product/UCC21520', price1k: 2.15 }] },

  // --- USB Hubs ---
  { competitor: 'USB2514B', manufacturer: 'Microchip', category: 'USB Hubs', tiParts: [{ part: 'TUSB8041', description: '4-Port USB 2.0 Hub Controller', url: 'https://www.ti.com/product/TUSB8041', price1k: 3.10 }] },
  { competitor: 'USB2517', manufacturer: 'Microchip', category: 'USB Hubs', tiParts: [{ part: 'TUSB8041', description: '4-Port USB 2.0 Hub Controller', url: 'https://www.ti.com/product/TUSB8041', price1k: 3.10 }] },
  { competitor: 'USB5744', manufacturer: 'Microchip', category: 'USB Hubs', tiParts: [{ part: 'TUSB8042A', description: '4-Port USB 3.0 Hub Controller', url: 'https://www.ti.com/product/TUSB8042A', price1k: 4.50 }] },
  { competitor: 'USB2240', manufacturer: 'Microchip', category: 'USB Hubs', tiParts: [{ part: 'TUSB8020B', description: '2-Port USB 3.0 Hub Controller', url: 'https://www.ti.com/product/TUSB8020B', price1k: 3.75 }] },
  { competitor: 'USB4715', manufacturer: 'Microchip', category: 'USB Hubs', tiParts: [{ part: 'TUSB8042A', description: '4-Port USB 3.0 Hub Controller', url: 'https://www.ti.com/product/TUSB8042A', price1k: 4.50 }] },
  { competitor: 'GL850G', manufacturer: 'Genesys Logic', category: 'USB Hubs', tiParts: [{ part: 'TUSB2046B', description: '4-Port USB 2.0 Hub', url: 'https://www.ti.com/product/TUSB2046B', price1k: 1.85 }] },
  { competitor: 'GL3523', manufacturer: 'Genesys Logic', category: 'USB Hubs', tiParts: [{ part: 'TUSB8042A', description: '4-Port USB 3.0 Hub Controller', url: 'https://www.ti.com/product/TUSB8042A', price1k: 4.50 }] },
  { competitor: 'FE1.1s', manufacturer: 'Terminus Technology', category: 'USB Hubs', tiParts: [{ part: 'TUSB2046B', description: '4-Port USB 2.0 Hub', url: 'https://www.ti.com/product/TUSB2046B', price1k: 1.85 }] },
  { competitor: 'VL817', manufacturer: 'VIA Labs', category: 'USB Hubs', tiParts: [{ part: 'TUSB8042A', description: '4-Port USB 3.0 Hub Controller', url: 'https://www.ti.com/product/TUSB8042A', price1k: 4.50 }] },
  { competitor: 'CYUSB3304', manufacturer: 'Infineon', category: 'USB Hubs', tiParts: [{ part: 'TUSB8042A', description: '4-Port USB 3.0 Hub Controller', url: 'https://www.ti.com/product/TUSB8042A', price1k: 4.50 }] },
  { competitor: 'RTS5411', manufacturer: 'Realtek', category: 'USB Hubs', tiParts: [{ part: 'TUSB8041', description: '4-Port USB 2.0 Hub Controller', url: 'https://www.ti.com/product/TUSB8041', price1k: 3.10 }] },

  // --- USB Redrivers / Signal Conditioners ---
  { competitor: 'PI3USB30532', manufacturer: 'Diodes Inc', category: 'USB Redrivers', tiParts: [{ part: 'TUSB1002', description: 'USB 3.1 Gen2 10Gbps Redriver', url: 'https://www.ti.com/product/TUSB1002', price1k: 1.95 }] },
  { competitor: 'PI3USB102', manufacturer: 'Diodes Inc', category: 'USB Redrivers', tiParts: [{ part: 'TUSB1002', description: 'USB 3.1 Gen2 10Gbps Redriver', url: 'https://www.ti.com/product/TUSB1002', price1k: 1.95 }] },
  { competitor: 'NB7VPQ904M', manufacturer: 'onsemi', category: 'USB Redrivers', tiParts: [{ part: 'TUSB1002', description: 'USB 3.1 Gen2 10Gbps Linear Redriver', url: 'https://www.ti.com/product/TUSB1002', price1k: 1.95 }] },
  { competitor: 'PTN36502', manufacturer: 'NXP', category: 'USB Redrivers', tiParts: [{ part: 'TUSB1002', description: 'USB 3.1 Gen2 10Gbps Redriver', url: 'https://www.ti.com/product/TUSB1002', price1k: 1.95 }] },
  { competitor: 'HD3SS3220', manufacturer: 'Renesas', category: 'USB Redrivers', tiParts: [{ part: 'HD3SS3220', description: 'USB Type-C DRP Port Controller w/ SuperSpeed 2:1 Mux', url: 'https://www.ti.com/product/HD3SS3220', price1k: 1.25 }] },
  { competitor: 'CBTL02042A', manufacturer: 'NXP', category: 'USB Redrivers', tiParts: [{ part: 'TUSB542', description: 'USB 2.0 Signal Conditioner', url: 'https://www.ti.com/product/TUSB542', price1k: 0.65 }] },
  { competitor: 'PI3EQX1002E', manufacturer: 'Diodes Inc', category: 'USB Redrivers', tiParts: [{ part: 'TUSB1002', description: 'USB 3.1 10Gbps Linear Redriver', url: 'https://www.ti.com/product/TUSB1002', price1k: 1.95 }] },
  { competitor: 'TUSB1146', manufacturer: 'NXP', category: 'USB Redrivers', tiParts: [{ part: 'TUSB1146', description: 'USB Type-C Alt-Mode Redriver', url: 'https://www.ti.com/product/TUSB1146', price1k: 1.50 }] },
  { competitor: 'IP2721', manufacturer: 'Injoinic', category: 'USB Redrivers', tiParts: [{ part: 'TUSB542', description: 'USB 2.0 Signal Conditioner', url: 'https://www.ti.com/product/TUSB542', price1k: 0.65 }] },

  // --- USB Host Controllers ---
  { competitor: 'MAX3421E', manufacturer: 'Maxim', category: 'USB Host Controllers', tiParts: [{ part: 'TUSB3410', description: 'USB Device Controller with UART', url: 'https://www.ti.com/product/TUSB3410', price1k: 2.30 }] },
  { competitor: 'ISP1760', manufacturer: 'NXP', category: 'USB Host Controllers', tiParts: [{ part: 'TUSB7340', description: 'USB 3.0 xHCI Host Controller', url: 'https://www.ti.com/product/TUSB7340', price1k: 6.50 }] },
  { competitor: 'ISP1362', manufacturer: 'NXP', category: 'USB Host Controllers', tiParts: [{ part: 'TUSB6250', description: 'USB 2.0 SATA Bridge Controller', url: 'https://www.ti.com/product/TUSB6250', price1k: 3.80 }] },
  { competitor: 'ISP1563', manufacturer: 'NXP', category: 'USB Host Controllers', tiParts: [{ part: 'TUSB7340', description: 'USB 3.0 4-Port xHCI Host Controller', url: 'https://www.ti.com/product/TUSB7340', price1k: 6.50 }] },
  { competitor: 'CYUSB3014', manufacturer: 'Infineon', category: 'USB Host Controllers', tiParts: [{ part: 'TUSB7320', description: 'USB 3.0 2-Port xHCI Host Controller', url: 'https://www.ti.com/product/TUSB7320', price1k: 5.25 }] },
  { competitor: 'uPD720202', manufacturer: 'Renesas', category: 'USB Host Controllers', tiParts: [{ part: 'TUSB7340', description: 'USB 3.0 4-Port xHCI Host Controller', url: 'https://www.ti.com/product/TUSB7340', price1k: 6.50 }] },
  { competitor: 'uPD720201', manufacturer: 'Renesas', category: 'USB Host Controllers', tiParts: [{ part: 'TUSB7320', description: 'USB 3.0 2-Port xHCI Host Controller', url: 'https://www.ti.com/product/TUSB7320', price1k: 5.25 }] },
  { competitor: 'VL805', manufacturer: 'VIA Labs', category: 'USB Host Controllers', tiParts: [{ part: 'TUSB7340', description: 'USB 3.0 4-Port xHCI Host Controller', url: 'https://www.ti.com/product/TUSB7340', price1k: 6.50 }] },
  { competitor: 'ASM1142', manufacturer: 'ASMedia', category: 'USB Host Controllers', tiParts: [{ part: 'TUSB7320', description: 'USB 3.0 2-Port xHCI Host Controller', url: 'https://www.ti.com/product/TUSB7320', price1k: 5.25 }] },
  { competitor: 'ASM3242', manufacturer: 'ASMedia', category: 'USB Host Controllers', tiParts: [{ part: 'TUSB7340', description: 'USB 3.0 xHCI Host Controller', url: 'https://www.ti.com/product/TUSB7340', price1k: 6.50 }] },

  // --- USB Type-C / PD Controllers ---
  { competitor: 'CYPD3177', manufacturer: 'Infineon', category: 'USB Type-C', tiParts: [{ part: 'TPS25750', description: 'USB Type-C & PD 3.0 Controller', url: 'https://www.ti.com/product/TPS25750', price1k: 3.50 }] },
  { competitor: 'CYPD3125', manufacturer: 'Infineon', category: 'USB Type-C', tiParts: [{ part: 'TPS65988', description: 'Dual-Port USB Type-C PD Controller', url: 'https://www.ti.com/product/TPS65988', price1k: 4.20 }] },
  { competitor: 'FUSB302', manufacturer: 'onsemi', category: 'USB Type-C', tiParts: [{ part: 'TPS25750', description: 'USB Type-C & PD Controller', url: 'https://www.ti.com/product/TPS25750', price1k: 3.50 }] },
  { competitor: 'FUSB307', manufacturer: 'onsemi', category: 'USB Type-C', tiParts: [{ part: 'TPS65987D', description: 'USB Type-C PD Controller w/ Integrated Power Path', url: 'https://www.ti.com/product/TPS65987D', price1k: 3.95 }] },
  { competitor: 'PTN5110', manufacturer: 'NXP', category: 'USB Type-C', tiParts: [{ part: 'TPS25750', description: 'USB Type-C & PD 3.0 Controller', url: 'https://www.ti.com/product/TPS25750', price1k: 3.50 }] },
  { competitor: 'TCPC', manufacturer: 'Richtek', category: 'USB Type-C', tiParts: [{ part: 'TPS65982', description: 'USB Type-C & PD Controller', url: 'https://www.ti.com/product/TPS65982', price1k: 3.10 }] },
  { competitor: 'WUSB3801', manufacturer: 'Will Semiconductor', category: 'USB Type-C', tiParts: [{ part: 'TUSB322I', description: 'USB Type-C Configuration Channel Logic', url: 'https://www.ti.com/product/TUSB322I', price1k: 0.55 }] },

  // --- USB Mux / Switches ---
  { competitor: 'PI3USB9281', manufacturer: 'Diodes Inc', category: 'USB Switches', tiParts: [{ part: 'TS3USB221', description: 'USB 2.0 1:2 Mux/Demux Switch', url: 'https://www.ti.com/product/TS3USB221', price1k: 0.45 }] },
  { competitor: 'FSA4480', manufacturer: 'onsemi', category: 'USB Switches', tiParts: [{ part: 'TS3USB221', description: 'USB 2.0 High-Speed Mux/Demux', url: 'https://www.ti.com/product/TS3USB221', price1k: 0.45 }] },
  { competitor: 'CBTL06GP213', manufacturer: 'NXP', category: 'USB Switches', tiParts: [{ part: 'HD3SS460', description: 'USB Type-C SuperSpeed Alt-Mode Mux', url: 'https://www.ti.com/product/HD3SS460', price1k: 2.10 }] },
  { competitor: 'PI3DPX1207C', manufacturer: 'Diodes Inc', category: 'USB Switches', tiParts: [{ part: 'HD3SS460', description: 'USB/DP Alt-Mode SuperSpeed Mux', url: 'https://www.ti.com/product/HD3SS460', price1k: 2.10 }] },
];

function CrossRef() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [searched, setSearched] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const inputRef = useRef(null);
  const suggestionsRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
          inputRef.current && !inputRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (value) => {
    setQuery(value);
    if (value.trim().length >= 2) {
      const q = value.trim().toLowerCase();
      const matched = CROSSREF_DB.filter(entry =>
        entry.competitor.toLowerCase().includes(q) ||
        entry.manufacturer.toLowerCase().includes(q)
      ).slice(0, 8);
      setSuggestions(matched);
      setShowSuggestions(matched.length > 0);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const doSearch = (searchQuery) => {
    const q = (searchQuery || query).trim().toLowerCase();
    if (!q) return;
    setShowSuggestions(false);
    setSearched(true);

    const matched = CROSSREF_DB.filter(entry =>
      entry.competitor.toLowerCase().includes(q) ||
      entry.manufacturer.toLowerCase().includes(q) ||
      entry.category.toLowerCase().includes(q) ||
      entry.tiParts.some(tp => tp.part.toLowerCase().includes(q))
    );
    setResults(matched);
  };

  const selectSuggestion = (entry) => {
    setQuery(entry.competitor);
    setShowSuggestions(false);
    setSearched(true);
    setResults([entry]);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      doSearch();
    }
  };

  return (
    <div className="crossref-page">
      <h1 className="crossref-title" onClick={() => { setQuery(''); setResults([]); setSearched(false); setSuggestions([]); setShowSuggestions(false); }} style={{ cursor: 'pointer' }}>CrossRef</h1>
      <p className="crossref-subtitle">
        Find TI equivalents for competitor semiconductor parts
      </p>

      {/* Search input */}
      <div className="crossref-search-wrapper">
        <div className="crossref-search-box">
          <svg className="crossref-search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={inputRef}
            type="text"
            className="crossref-input"
            placeholder="Enter competitor part (e.g. STM32F103, AD8221)"
            value={query}
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => suggestions.length > 0 && setShowSuggestions(true)}
          />
          {query && (
            <button className="crossref-clear" onClick={() => { setQuery(''); setResults([]); setSearched(false); setSuggestions([]); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <circle cx="12" cy="12" r="10" />
                <line x1="15" y1="9" x2="9" y2="15" />
                <line x1="9" y1="9" x2="15" y2="15" />
              </svg>
            </button>
          )}
        </div>
        <button className="crossref-search-btn" onClick={() => doSearch()}>Search</button>

        {/* Suggestions dropdown */}
        {showSuggestions && (
          <div ref={suggestionsRef} className="crossref-suggestions">
            {suggestions.map((entry, i) => (
              <button key={i} className="crossref-suggestion-item" onClick={() => selectSuggestion(entry)}>
                <span className="suggestion-part">{entry.competitor}</span>
                <span className="suggestion-mfr">{entry.manufacturer}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Results */}
      {searched && results.length === 0 && (
        <div className="crossref-no-results">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" width="40" height="40">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          <p>No cross-reference found for "<strong>{query}</strong>"</p>
          <p className="crossref-no-results-hint">Try searching by part number, manufacturer, or category</p>
          <a
            href={`https://www.ti.com/cross-reference-search-results.html#702702702702702702702702702702702702702702702702702?searchTerm=${encodeURIComponent(query)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="crossref-ti-link"
          >
            Search on TI.com
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
              <polyline points="15 3 21 3 21 9" />
              <line x1="10" y1="14" x2="21" y2="3" />
            </svg>
          </a>
        </div>
      )}

      {results.length > 0 && (
        <div className="crossref-results">
          {results.map((entry, i) => (
            <div key={i} className="crossref-result-card">
              <div className="crossref-competitor">
                <div className="crossref-competitor-header">
                  <span className="crossref-competitor-part">{entry.competitor}</span>
                  <span className="crossref-competitor-badge">{entry.manufacturer}</span>
                </div>
                <span className="crossref-competitor-category">{entry.category}</span>
              </div>

              <div className="crossref-arrow">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                  <line x1="12" y1="5" x2="12" y2="19" />
                  <polyline points="19 12 12 19 5 12" />
                </svg>
              </div>

              {entry.tiParts.map((tp, j) => (
                <a key={j} href={tp.url} target="_blank" rel="noopener noreferrer" className="crossref-ti-part">
                  <div className="crossref-ti-part-info">
                    <span className="crossref-ti-part-number">{tp.part}</span>
                    <span className="crossref-ti-part-desc">{tp.description}</span>
                    {tp.price1k != null && (
                      <span className="crossref-ti-part-price">
                        ${tp.price1k.toFixed(2)} <span className="crossref-price-qty">(1ku)</span>
                      </span>
                    )}
                  </div>
                  <div className="crossref-ti-part-action">
                    <span className="crossref-view-label">View</span>
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                      <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                      <polyline points="15 3 21 3 21 9" />
                      <line x1="10" y1="14" x2="21" y2="3" />
                    </svg>
                  </div>
                </a>
              ))}
            </div>
          ))}

          <div className="crossref-actions">
            <button className="crossref-new-search" onClick={() => { setQuery(''); setResults([]); setSearched(false); setSuggestions([]); setShowSuggestions(false); inputRef.current && inputRef.current.focus(); }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="16" height="16">
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              New Search
            </button>
            <a
              href={`https://www.ti.com/cross-reference-search-results.html?searchTerm=${encodeURIComponent(query)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="crossref-ti-link"
            >
              See more on TI.com
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="14" height="14">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
                <polyline points="15 3 21 3 21 9" />
                <line x1="10" y1="14" x2="21" y2="3" />
              </svg>
            </a>
          </div>
        </div>
      )}

      {/* Browse by manufacturer */}
      {!searched && (
        <div className="crossref-browse">
          <h3 className="crossref-browse-title">Browse by Manufacturer</h3>
          <div className="crossref-mfr-grid">
            {['Analog Devices', 'STMicroelectronics', 'Microchip', 'NXP', 'Infineon', 'onsemi', 'Maxim', 'Nordic', 'Espressif', 'Renesas', 'Silicon Labs', 'FTDI', 'Rohm', 'Allegro', 'Diodes Inc', 'Torex', 'MPS', 'Semtech', 'Broadcom', 'Genesys Logic', 'VIA Labs', 'ASMedia'].map(mfr => (
              <button key={mfr} className="crossref-mfr-chip" onClick={() => { setQuery(mfr); doSearch(mfr); }}>
                {mfr}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default CrossRef;
