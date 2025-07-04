// Management.jsx - Updated with CCR functionality
import { FileText } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import CCRModal from './CCR/CCRModal'; // Add this import
import DefaultAssigmentManager from './DefaultAssigmentManager.jsx/DefaultAssigmentManager';
import FileManager from './DocumentsForDownloadComponent/FileManager';
import UserManagement from './UserManagement/UserManagement';

const Management = () => {
  const [activeSection, setActiveSection] = useState('agents');
  const [showCCRModal, setShowCCRModal] = useState(false); // Add CCR modal state

  return (
    <div>
      <nav className='navbar navbar-expand-lg bg-body my-5'>
        <div className='container-fluid'>
          <button
            className='navbar-toggler ms-auto'
            type='button'
            data-bs-toggle='collapse'
            data-bs-target='#navbarColor04'
            aria-controls='navbarColor04'
            aria-expanded='false'
            aria-label='Toggle navigation'
          >
            <span className='navbar-toggler-icon'></span>
          </button>
          <div className='collapse navbar-collapse' id='navbarColor04'>
            <ul className='navbar-nav bg-body-tertiary'>
              <li className='nav-item'>
                <Link
                  className='btn btn-sm btn-outline-info mb-2'
                  onClick={() => {
                    setActiveSection('agents');
                  }}
                >
                  Agents Management
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className='btn btn-sm btn-outline-info mb-2'
                  onClick={() => {
                    setActiveSection('default_assigment');
                  }}
                >
                  Default Assigment Management
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  className='btn btn-sm btn-outline-info mb-2'
                  onClick={() => {
                    setActiveSection('documents');
                  }}
                >
                  Document For Download Management
                </Link>
              </li>
              {/* Add CCR Reporting button */}
              <li className='nav-item'>
                <Link
                  className='btn btn-sm btn-outline-warning mb-2'
                  onClick={() => {
                    setShowCCRModal(true);
                  }}
                >
                  <FileText className='me-2' size={16} />
                  CCR Reporting
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      {/* Existing sections */}
      {activeSection === 'agents' && <UserManagement />}
      {activeSection === 'documents' && <FileManager />}
      {activeSection === 'default_assigment' && <DefaultAssigmentManager />}

      {/* CCR Modal */}
      <CCRModal show={showCCRModal} onHide={() => setShowCCRModal(false)} />
    </div>
  );
};

export default Management;
