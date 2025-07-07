// components/CCRModalParts/AlertContainer.jsx
import { AlertCircle, CheckCircle, XCircle } from 'lucide-react';

const AlertContainer = ({ alerts, removeAlert }) => {
  const getAlertClass = (type) => {
    switch (type) {
      case 'success':
        return 'alert alert-success';
      case 'error':
        return 'alert alert-danger';
      case 'warning':
        return 'alert alert-warning';
      default:
        return 'alert alert-info';
    }
  };

  const getAlertIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle size={16} />;
      case 'error':
        return <XCircle size={16} />;
      case 'warning':
        return <AlertCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  return (
    <div className='position-fixed top-0 end-0 p-3' style={{ zIndex: 1060 }}>
      {alerts.map((alert) => (
        <div
          key={`alert-${alert.id}`}
          className={`${getAlertClass(alert.type)} alert-dismissible fade show`}
          role='alert'
        >
          <div className='d-flex align-items-center'>
            {getAlertIcon(alert.type)}
            <span className='ms-2'>{alert.message}</span>
          </div>
          <button
            type='button'
            className='btn-close'
            onClick={() => removeAlert(alert.id)}
            aria-label='Close'
          ></button>
        </div>
      ))}
    </div>
  );
};

export default AlertContainer;
