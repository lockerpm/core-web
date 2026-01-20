import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from "react-i18next";

import {
  Card,
  Space,
  Button
} from '@lockerpm/design';

import itemsComponents from '../items';

import emergencyAccessServices from '../../services/emergency-access';

import global from '../../config/global';

function EmergencyAccessInvitations() {
  const { ImageIcon } = itemsComponents;
  const { t } = useTranslation();
  const [listGranted, setListGranted] = useState([]);
  const [accepting, setAccepting] = useState(false);
  const [removing, setRemoving] = useState(false);

  useEffect(() => {
    fetchData();
  }, [])

  const invitation = useMemo(() => {
    const invitations = listGranted.filter(
      item => item.status === global.constants.STATUS.INVITED
    )
    return invitations[0] || null
  }, [listGranted])

  const fetchData = async () => {
    await emergencyAccessServices.list_granted().then(res => {
      setListGranted(res)
    }).catch(() => {
      setListGranted([])
    })
  }

  const acceptInvitation = async () => {
    setAccepting(true)
    await emergencyAccessServices.accept(invitation.id).then(() => {
      fetchData();
      global.pushSuccess(t('notification.success.emergency_access.accepted'))
    }).catch((error) => {
      global.pushError(error)
    })
    setAccepting(false)
  }

  const removeInvitation = async () => {
    global.confirm(async () => {
      setRemoving(true);
      await emergencyAccessServices.remove(invitation.id).then(() => {
        fetchData();
        global.pushSuccess(t('notification.success.emergency_access.removed', { user: invitation.email }))
      }).catch((error) => {
        global.pushError(error)
      })
      setRemoving(false);
    }, {
      content: t('security.emergency_access.delete_question'),
      okText: t('button.ok'),
      okButtonProps: { danger: false },
    })
  }

  return (
    <>
      {
        !!invitation && <div
          className="p-4 md:px-8 emergency-access-invitations"
          style={{ height: 'auto' }}
        >
          <Card>
            <div className='flex items-center justify-between'>
              <div>
                <p className='font-semibold'>
                  {t('notice.emergency_access_invitations.title')}
                </p>
                <p>
                  {t('notice.emergency_access_invitations.description', { owner: invitation.full_name })}
                </p>
                <p>
                  {t('notice.emergency_access_invitations.access_type', { type: invitation.type })}
                </p>
                <Space className='mt-4'>
                  <Button
                    disabled={accepting}
                    loading={removing}
                    onClick={removeInvitation}
                  >
                    {t('security.emergency_access.actions.reject')}
                  </Button>
                  <Button
                    type="primary"
                    disabled={removing}
                    loading={accepting}
                    onClick={acceptInvitation}
                  >
                    {t('security.emergency_access.actions.accept')}
                  </Button>
                </Space>
              </div>
              <ImageIcon
                name="invitation"
                width={140}
                height={120}
              />
            </div>
          </Card>
        </div>
      }
    </>
  );
}

export default EmergencyAccessInvitations;
