import { useState, useCallback, useEffect } from "react";
import {
  Card,
  BlockStack,
  TextField,
  RadioButton,
  InlineStack,
  Button,
  Text,
  Divider,
  Box,
  ButtonGroup,
  Collapsible,
  Icon,
  Tooltip,
  Popover,
  ActionList,

} from "@shopify/polaris";

import { SettingsIcon, AlertCircleIcon, MagicIcon, ClockIcon, TextAlignCenterIcon, TextAlignLeftIcon, TextAlignRightIcon, TextItalicIcon, TextBoldIcon } from '@shopify/polaris-icons';
import { ColorPickerPopoverItem } from "../common/ColorPickerPopoverItem";
import { SwitchIcon } from "../common/SwitchIcon";


export function CountDownPanel({ conf, onChange }) {

  const [open, setOpen] = useState(false);
  const [showCountdownTimer, setShowCountdownTimer] = useState(conf.isCountdown);
  const [visibility, setVisibility] = useState(conf.visibility);
  const [timeDuration, setTimeDuration] = useState<any>(conf.fixedDurationTime);;
  const [endDate, setEndDate] = useState(conf.endDateTime.split('T')[0]);
  const [endTime, setEndTime] = useState(conf.endDateTime.split('T')[1].split('Z')[0]);
  const [textValue, setTextValue] = useState(conf.msgText);
  const [activeAlignmentButtonIndex, setActiveAlignmentButtonIndex] = useState(conf.msgAlignment);
  const [activeTextBoldButton, setActiveTextBoldButton] = useState(conf.msgBold);
  const [activeTextItalicButton, setActiveItalicBoldButton] = useState(conf.msgItalic);
  const [textFontSize, setTextFontSize] = useState<any>(conf.msgSize);
  const defaultBgColor = conf.msgBgColor;
  const defaultTextColor = conf.msgTextColor;
  const [active, setActive] = useState<any>(null);

  const gatherStateData = () => ({
    showCountdownTimer,
    visibility,
    timeDuration,
    endDate,
    endTime,
    textValue,
    activeAlignmentButtonIndex,
    activeTextBoldButton,
    activeTextItalicButton,
    textFontSize,
  });

  // Send data to parent on any change
  useEffect(() => {
    if (onChange) {
      onChange(gatherStateData());
    }
  }, [
    showCountdownTimer,
    visibility,
    timeDuration,
    endDate,
    endTime,
    textValue,
    activeAlignmentButtonIndex,
    activeTextBoldButton,
    activeTextItalicButton,
    textFontSize,
    onChange,
  ]);

  const handleSettingsToggle = useCallback(() => setOpen((open) => !open), []);
  const handleSetTimeDuration = useCallback(
    (newValue: string) => setTimeDuration(newValue),
    [],
  );

  const toggleActive = (id: string) => () => {
    setActive((activeId: string) => (activeId !== id ? id : null));
  };

  const addRemainingTime = () => {
    setTextValue(prev => prev + "{{timer}}"); // append "abc"
  };

  const handleAlignmentButtonClick = useCallback(
    (index: number) => {
      if (activeAlignmentButtonIndex === index) return;
      setActiveAlignmentButtonIndex(index);
    },
    [activeAlignmentButtonIndex],
  );

  const handleTextBoldButtonClick = useCallback(() => setActiveTextBoldButton((activeTextBoldButton) => !activeTextBoldButton), []);
  const handleTextItalicButtonClick = useCallback(() => setActiveItalicBoldButton((activeTextItalicButton) => !activeTextItalicButton), []);
  const handleSetTextFontSize = useCallback(
    (newValue: string) => setTextFontSize(newValue),
    [],
  );


  return (
    < Card >
      <BlockStack gap="400">
        <InlineStack align="space-between" blockAlign="center">
          <Button
            onClick={handleSettingsToggle}
            disclosure={open ? 'up' : 'down'}
            ariaControls="collapsible-settings"
            variant="plain"
            icon={SettingsIcon}
          >
            Countdown timer
          </Button>
          <SwitchIcon checked={showCountdownTimer} onChange={setShowCountdownTimer} />
        </InlineStack>

        <Collapsible
          open={open}
          id="collapsible-settings"
          expandOnPrint
        >
          <BlockStack gap="200">
            {/* <Box width="100%"> */}
            <InlineStack blockAlign="center" align="space-between">
              <InlineStack>
                <RadioButton
                  label="Fixed duration"
                  checked={visibility === "showFixedDuration"}
                  id="fixedDuration"
                  onChange={() => setVisibility("showFixedDuration")}
                />
                <Tooltip content="The countdown resets after it ends">
                  <Icon
                    source={AlertCircleIcon}
                    tone="base"
                  />
                </Tooltip>

              </InlineStack>

              {visibility === "showFixedDuration" && (
                <Box width="30%">
                  <TextField
                    label=""
                    type="number"
                    value={timeDuration}
                    onChange={handleSetTimeDuration}
                    autoComplete="off"
                    min={0}
                    max={240}
                    prefix={<Icon source={ClockIcon} />}
                    suffix="min"
                  />
                </Box>
              )}
            </InlineStack>
            <InlineStack blockAlign="center" align="start">
              <RadioButton
                label="Ends at midnight (user's local time)"
                checked={visibility === "showEndsAtMidnight"}
                id="endsAtMidnight"
                onChange={() => setVisibility("showEndsAtMidnight")}
              />
              <Tooltip content="The countdown resets everyday at night">
                <Icon
                  source={AlertCircleIcon}
                  tone="base"
                />
              </Tooltip>
            </InlineStack>
            <InlineStack blockAlign="center" align="start">
              <RadioButton
                label="Custom end date"
                checked={visibility === "showCustomEndDate"}
                id="customEndDate"
                onChange={() => setVisibility("showCustomEndDate")}
              />
              <Tooltip content="The countdown ends at a specific date and time. The countdown section will hide when it ends">
                <Icon
                  source={AlertCircleIcon}
                  tone="base"
                />
              </Tooltip>
            </InlineStack>

            {visibility === "showCustomEndDate" && (
              <InlineStack gap="0" blockAlign="center" align="space-between">
                <Box width="50%">
                  <TextField
                    type="date"
                    label="End date"
                    value={endDate}
                    onChange={setEndDate}
                    autoComplete="off"
                  />
                </Box>
                <Box width="45%">
                  <TextField
                    type="time"
                    label="End time (GMT-8)"
                    value={endTime}
                    onChange={setEndTime}
                    autoComplete="off"
                  />
                </Box>
              </InlineStack>
            )}

            {/* </Box> */}
            <Divider />
            <BlockStack gap="200">
              <InlineStack align="space-between">
                <Box width="65%">
                  <InlineStack align="space-between">
                    <Text as='p'>Message text</Text>
                    <Popover
                      active={active === 'popover'}
                      preferredAlignment="right"
                      activator={
                        <Button
                          variant="tertiary"
                          onClick={toggleActive('popover')}
                          icon={SettingsIcon}
                          accessibilityLabel="Other save actions"
                        />
                      }
                      autofocusTarget="first-node"
                      onClose={toggleActive('popover')}
                    >
                      <ActionList
                        actionRole="menuitem"
                        sections={[
                          {
                            items: [
                              {
                                content: 'Add variable',
                                suffix: <Icon source={AlertCircleIcon} />
                              },
                            ],
                          },
                          {
                            title: 'Timer',
                            items: [
                              {
                                content: 'Remaining time',
                                onAction: addRemainingTime,
                              }
                            ]
                          }
                        ]}
                      />
                    </Popover>
                  </InlineStack>
                  <TextField
                    label=""
                    value={textValue}
                    onChange={setTextValue}
                    autoComplete="off"
                  />
                </Box>
                <InlineStack blockAlign="end">
                  <Button icon={MagicIcon} size="large">
                    AI suggestion
                  </Button>
                </InlineStack>
              </InlineStack>
            </BlockStack>

            <InlineStack align="space-around" blockAlign="end">
              <Box width="20%">
                <Text as="p" variant="bodySm">Background</Text>
                <ColorPickerPopoverItem subtitle="" defaultColorSetting="#000" colorWidth="100%" />
              </Box>
              <Box>
                <Text as="p" variant="bodySm">Text</Text>
                <ColorPickerPopoverItem subtitle="" defaultColorSetting="#AAA" colorWidth="100%" />
              </Box>
              <Box>
                <Text as="p" variant="bodySm">Alignment</Text>
                <ButtonGroup gap="extraTight">
                  <Button
                    pressed={activeAlignmentButtonIndex === 0}
                    onClick={() => handleAlignmentButtonClick(0)}
                    icon={TextAlignLeftIcon}
                  >
                  </Button>
                  <Button
                    pressed={activeAlignmentButtonIndex === 1}
                    onClick={() => handleAlignmentButtonClick(1)}
                    icon={TextAlignCenterIcon}
                  >
                  </Button>
                  <Button
                    pressed={activeAlignmentButtonIndex === 2}
                    onClick={() => handleAlignmentButtonClick(2)}
                    icon={TextAlignRightIcon}
                  >
                  </Button>
                </ButtonGroup>

              </Box>
              <Box>
                <Text as="p" variant="bodySm">Style</Text>
                <ButtonGroup gap="extraTight">
                  <Button
                    pressed={activeTextBoldButton}
                    onClick={() => handleTextBoldButtonClick()}
                    icon={TextBoldIcon}
                  >
                  </Button>
                  <Button
                    pressed={activeTextItalicButton}
                    onClick={() => handleTextItalicButtonClick()}
                    icon={TextItalicIcon}
                  >
                  </Button>
                </ButtonGroup>
              </Box>
              <Box width="25%">
                <Text as="p" variant="bodySm">Size</Text>
                <TextField
                  label=""
                  type="number"
                  value={textFontSize}
                  onChange={handleSetTextFontSize}
                  autoComplete="off"
                  min={1}
                  max={100}
                  suffix="px"
                />
              </Box>
            </InlineStack>

          </BlockStack>
        </Collapsible >

      </BlockStack >
    </Card >
  );
}



