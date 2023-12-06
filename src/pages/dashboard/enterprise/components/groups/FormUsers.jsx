import React, { useState, useEffect } from "react"
import { Space, Button, Drawer, Select } from "@lockerpm/design"

import { } from "@ant-design/icons"

import { } from "react-redux"
import { useTranslation } from "react-i18next"

function FormUsers(props) {
  const {
    visible = false,
    item = null,
    onClose = () => { },
    onReload = () => { }
  } = props
  const { t } = useTranslation()

  const [loading, setLoading] = useState(false)
  const [callingAPI, setCallingAPI] = useState(false)
  const [selectedUser, setSelectedUser] = useState(null)

  useEffect(() => {
  }, [visible])

  const handleSave = async () => {
  }

  return (
    <div className={props.className}>
      <Drawer
        title={t(`enterprise_groups.users`)}
        placement='right'
        onClose={onClose}
        open={visible}
        footer={
          <Space className='flex items-center justify-end'>
            <Button disabled={callingAPI} onClick={onClose}>
              {t("button.cancel")}
            </Button>
            <Button type='primary' loading={callingAPI} onClick={handleSave}>
              {t("button.save")}
            </Button>
          </Space>
        }
      >
        <div className="flex items-center justify-between">
          <Select
            className="flex-1 mr-2"
            placeholder={t('placeholder.select_users')}
            value={selectedUser}
          />
          <Button type="primary">
            {t('button.add')}
          </Button>
        </div>
      </Drawer>
    </div>
  )
}

export default FormUsers
