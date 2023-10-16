import React, { useMemo, useState, useEffect } from 'react';
import {
  Input,
  Row,
  Col,
  Button
} from '@lockerpm/design';
import {
  PlusCircleOutlined,
  MinusCircleOutlined
} from '@ant-design/icons';

import { useSelector } from 'react-redux';
import { useTranslation } from "react-i18next";

import { red } from '@ant-design/colors';

import global from '../../../../../../config/global';

function SeedPhrase(props) {
  const {
    value = '',
    disabled = false,
    onChange = () => {}
  } = props
  const { t } = useTranslation()

  const MIN_WORD_COUNT = 12
  const MAX_WORD_COUNT = 24

  const [workCount, setWorkCount] = useState(MIN_WORD_COUNT)
  const [newValue, setNewValue] = useState([])

  useEffect(() => {
    const words = value?.split(' ')
    setWorkCount(words.length > MIN_WORD_COUNT ? MAX_WORD_COUNT : MIN_WORD_COUNT)
  }, [])
  
  useEffect(() => {
    const words = value?.split(' ')
    while (words.length < MAX_WORD_COUNT) {
      words.push('')
    }
    setNewValue(words)
  }, [value])

  const handleChangeWord = (value, index) => {
    const validValue = value.trim().split(' ').join('')
    const words = newValue.map((v, i) => i === index ? validValue : v)
    onChange(words.join(' '))
  }

  const handleRemoveWord = (index) => {
    if (index + 1 <= MIN_WORD_COUNT) {
      return
    }
    const words = newValue.filter((v, i) => i !== index)
    onChange(words.join(' '))
    setWorkCount(workCount - 1)
  }

  return (
    <div className={props.className}>
      <Row gutter={[8, 8]}>
        {
          newValue.filter((w, index) => index < workCount).map((w, index) => <Col key={index} span={8}>
            <Input
              prefix={<p>{index + 1}.</p>}
              suffix={workCount > MIN_WORD_COUNT && <span
                  className='cursor-pointer'
                  onClick={() => handleRemoveWord(index)}
                >
                  <MinusCircleOutlined style={{ color: red.primary }}/>
                </span>
              }
              value={w}
              disabled={disabled}
              onChange={(e) => handleChangeWord(e.target.value, index)}
            />
          </Col>)
        }
        {
          workCount < 24 && !disabled && <Col span={8}>
            <Button
              className="w-full"
              type="primary"
              ghost
              icon={<PlusCircleOutlined />}
              onClick={() => setWorkCount(workCount + 1)}
            >
              {t('button.add')}
            </Button>
          </Col>
        }
      </Row>
    </div>
  );
}

export default SeedPhrase;
