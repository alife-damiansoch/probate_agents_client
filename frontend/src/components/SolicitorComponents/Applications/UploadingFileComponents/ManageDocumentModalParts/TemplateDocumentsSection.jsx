import TemplateDocumentCard from './TemplateDocumentCard';

const TemplateDocumentsSection = ({
  hasUndertaking,
  hasLoanAgreement,
  isGeneratingUndertaking,
  isGeneratingAgreement,
  onGenerateUndertaking,
  onGenerateAgreement,
}) => {
  const undertakingIcon = (
    <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
      <path
        fillRule='evenodd'
        d='M9.243 3.03a1 1 0 01.727 1.213L9.53 6h2.94l.56-2.243a1 1 0 111.94.486L14.53 6H17a1 1 0 110 2h-2.97l-1 4H15a1 1 0 110 2h-2.47l-.56 2.242a1 1 0 11-1.94-.485L10.47 14H7.53l-.56 2.242a1 1 0 11-1.94-.485L5.47 14H3a1 1 0 110-2h2.97l1-4H5a1 1 0 110-2h2.47l.56-2.243a1 1 0 011.213-.727zM9.03 8l-1 4h2.94l1-4H9.03z'
        clipRule='evenodd'
      />
    </svg>
  );

  const agreementIcon = (
    <svg width='16' height='16' fill='currentColor' viewBox='0 0 20 20'>
      <path
        fillRule='evenodd'
        d='M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 110 2h-3a1 1 0 01-1-1v-2a1 1 0 00-1-1H9a1 1 0 00-1 1v2a1 1 0 01-1 1H4a1 1 0 110-2V4zm3 1h2v2H7V5zm2 4H7v2h2V9zm2-4h2v2h-2V5zm2 4h-2v2h2V9z'
        clipRule='evenodd'
      />
    </svg>
  );

  return (
    <div className='mb-5'>
      <div className='d-flex align-items-center gap-3 mb-4'>
        <div
          className='d-flex align-items-center justify-content-center rounded-3'
          style={{
            width: '40px',
            height: '40px',
            background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            color: 'white',
          }}
        >
          <svg width='20' height='20' fill='currentColor' viewBox='0 0 20 20'>
            <path
              fillRule='evenodd'
              d='M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z'
              clipRule='evenodd'
            />
          </svg>
        </div>
        <div>
          <h5 className='mb-0 fw-bold' style={{ color: '#1e293b' }}>
            Template Documents
          </h5>
          <p className='mb-0 text-muted small'>
            Generate legal documents from templates
          </p>
        </div>
      </div>

      <div className='row g-3'>
        {/* Solicitor Undertaking Card */}
        <TemplateDocumentCard
          title='Solicitor Undertaking'
          description='Legal commitment document'
          icon={undertakingIcon}
          isGenerated={hasUndertaking}
          isGenerating={isGeneratingUndertaking}
          onGenerate={onGenerateUndertaking}
          iconBg='#f59e0b'
          bgColors={{
            background: 'linear-gradient(135deg, #fef3c7 0%, #fde68a 100%)',
            border: '2px solid #f59e0b',
            textColor: '#92400e',
            buttonBg: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
          }}
        />

        {/* Advancement Agreement Card */}
        <TemplateDocumentCard
          title='Advancement Agreement'
          description='Financial agreement document'
          icon={agreementIcon}
          isGenerated={hasLoanAgreement}
          isGenerating={isGeneratingAgreement}
          onGenerate={onGenerateAgreement}
          iconBg='#10b981'
          bgColors={{
            background: 'linear-gradient(135deg, #dcfce7 0%, #bbf7d0 100%)',
            border: '2px solid #10b981',
            textColor: '#047857',
            buttonBg: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          }}
        />

        {/* Placeholder for future template documents */}
        <div className='col-lg-4 col-md-6'>
          <div
            className='p-3 rounded-4 h-100 d-flex align-items-center justify-content-center'
            style={{
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
              border: '2px dashed #cbd5e1',
              minHeight: '120px',
            }}
          >
            <div className='text-center'>
              <svg
                width='24'
                height='24'
                fill='#94a3b8'
                viewBox='0 0 20 20'
                className='mb-2'
              >
                <path
                  fillRule='evenodd'
                  d='M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z'
                  clipRule='evenodd'
                />
              </svg>
              <p className='mb-0 text-muted small'>
                More templates coming soon
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TemplateDocumentsSection;
