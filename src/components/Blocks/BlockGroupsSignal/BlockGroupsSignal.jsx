import React from 'react';
import { graphql, navigate, useStaticQuery } from 'gatsby';
import { BotProtectionProvider, BotProtectionStatus, ProtectedLink } from '../../Global/BotProtection/BotProtection';

import './styles.scss';

const BlockGroupsSignal = ({ block }) => {
  const { allDatoCmsGroup: signalGroups } = useStaticQuery(graphql`
    query SignalChat {
      allDatoCmsGroup(filter: { signalChat: { ne: "" } }, sort: { title: ASC }) {
        nodes {
          id
          title
          signalChat
        }
      }
    }
  `);

  if (!signalGroups || signalGroups.nodes.length === 0) {
    return null;
  }

  return (
    <div className="ui-block-groups-signal">
      <BotProtectionProvider turnstileMode="managed" sessionDuration={60}>
        <BotProtectionStatus buttonLabel="Open Signal" />
        <div className="row mt-5">
          {signalGroups.nodes.map((group) => {
            return (
              <div className="col-md-6 mb-3">
                <ProtectedLink
                  to={group.signalChat}
                  className="custom-btn custom-btn-primary w-100"
                  // TODO: Disable before production
                  onClick={() => {
                    navigate(group.signalChat);
                  }}
                >
                  {group.title}
                </ProtectedLink>
              </div>
            );
          })}
        </div>
      </BotProtectionProvider>
    </div>
  );
};

export default BlockGroupsSignal;
