import React from 'react';

import Access from './components/Access/Access';
import Expiration from './components/Expiration/Expiration';
import Watermarking from './components/Watermarking/Watermarking';
import Forwarding from './components/Forwarding/Forwarding';
import Button from 'components/Button/Button';
import './Policy.css';

export const ENCRYPT_STATES = {
  AUTHENTICATING: 0,
  UNPROTECTED: 1,
  PROTECTING: 2,
  PROTECTED: 3,
};

function Policy({
  encrypt,
  encryptState,
  file,
  login,
  openAuthModal,
  policy,
  updatePolicy,
  userId,
}) {
  const renderButtons = () => {
    switch (encryptState) {
      case ENCRYPT_STATES.AUTHENTICATING:
        return <Button disabled>Authenticating...</Button>;
      case ENCRYPT_STATES.PROTECTING:
        return <Button disabled>Protecting...</Button>;
      case ENCRYPT_STATES.PROTECTED:
        return null;
      default:
        if (userId) {
          return (
            <Button data-testid="encryptFile" onClick={encrypt}>
              Protect File
            </Button>
          );
        }

        return (
          <>
            <Button onClick={openAuthModal}>Sign in to continue</Button>
            <Button disabled>Protect File</Button>
          </>
        );
    }
  };
  if (encryptState !== ENCRYPT_STATES.PROTECTED) {
    return (
      <div className="Policy" id="policy">
        <Access policy={policy} updatePolicy={updatePolicy} userId={userId} />
        <span className="Policy-buttons">{renderButtons()}</span>
      </div>
    );
  }
  return (
    <div className="Policy" id="policy">
      <Access
        policy={policy}
        encryptState={encryptState}
        updatePolicy={updatePolicy}
        userId={userId}
      />
      <hr className="Policy-rule" />
      <Expiration />
      <Watermarking />
      <Forwarding policy={policy} updatePolicy={updatePolicy} />
    </div>
  );
}

export default Policy;
