// src/components/SettingsView/MembershipTab.tsx
import React from 'react';
import { FlexboxGrid, Col, Panel } from 'rsuite';
import ComingSoonMembership from './ComingSoonMembership';   // ⬅️ the new placeholder component

interface Props {
  totalApps: number;
  cvCount: number;
  clCount: number;
  percentApps: number;
  percentCVs: number;
  percentCLs: number;
  filesLoading: boolean;
  onUpgrade: (plan: 'basic' | 'premium') => void;
}

const MAX_APPLICATIONS = 20;

const MembershipTab: React.FC<Props> = ({
  totalApps,
  cvCount,
  clCount,
  percentApps,
  percentCVs,
  percentCLs,
  filesLoading,
  onUpgrade
}) => (
  <div className="membership-tab">


    <h5 className="subject-title">Usage</h5>
    <div className="usage-bars">
      {[
        { label: 'Applications', count: totalApps, percent: percentApps, fillClass: 'fill-apps' },
        { label: 'CVs', count: filesLoading ? '…' : cvCount, percent: percentCVs, fillClass: 'fill-cvs' },
        { label: 'Cover Letters', count: filesLoading ? '…' : clCount, percent: percentCLs, fillClass: 'fill-cl' }
      ].map(item => (
        <div className="usage-item" key={item.label}>
          <div className="usage-label">
            <span>{item.label}</span>
            <span>
              {item.count}{item.label === 'Applications' ? ` / ${MAX_APPLICATIONS}` : ''}
            </span>
          </div>
          <div className="liquid-bar">
            <div
              className={`liquid-fill ${item.fillClass}`}
              style={{ width: `${item.percent}%` }}
            />
          </div>
        </div>
      ))}
    </div>

    {/* ─────────────  PLANS  ───────────── */}
    <h5 style={{ paddingTop: '20px' }} className="subject-title">Plans</h5>

    <FlexboxGrid justify="space-around" className="plan-grid">
      {/* Coming-Soon card – stretches full width of the grid */}
      <FlexboxGrid.Item componentClass={Col} colspan={24} md={24}>
        <Panel className="plan-card coming-soon-card" bordered>
          <ComingSoonMembership />
        </Panel>
      </FlexboxGrid.Item>

      {/*
        ─────────────────────────────────────────────────────────
        ORIGINAL PLAN CARDS – kept for future use, but inactive
        ─────────────────────────────────────────────────────────

      <FlexboxGrid.Item componentClass={Col} colspan={12} md={12}>
        <Panel className="plan-card basic" bordered>
          … “Basic Plan” JSX …
        </Panel>
      </FlexboxGrid.Item>

      <FlexboxGrid.Item componentClass={Col} colspan={12} md={12}>
        <Panel className="plan-card premium" bordered>
          … “Premium Plan” JSX …
        </Panel>
      </FlexboxGrid.Item>
      */}
    </FlexboxGrid>

    {/* ─────────────  USAGE  ───────────── */}

  </div>
);

export default MembershipTab;
