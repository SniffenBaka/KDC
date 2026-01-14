import React from 'react';
import { Calendar, MapPin } from 'lucide-react';

const BRAND = {
  primary: '#9333EA',
  primaryHover: '#A855F7',
};

const TimelineItem = ({ 
  date = "",
  title = "",
  description = "",
  location = "",
  side = "left" // left or right
}) => {
  const isLeft = side === "left";

  return (
    <div style={{
      display: 'flex',
      gap: '24px',
      marginBottom: '40px',
      flexDirection: isLeft ? 'row' : 'row-reverse',
      animation: 'fadeIn 0.5s ease-out',
    }}>
      {/* Content */}
      <div style={{
        flex: 1,
        textAlign: isLeft ? 'right' : 'left',
      }}>
        <div style={{
          background: 'rgba(255, 255, 255, 0.02)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          borderRadius: '12px',
          padding: '20px',
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(147, 51, 234, 0.05)';
          e.currentTarget.style.borderColor = BRAND.border;
          e.currentTarget.style.transform = 'translateY(-2px)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)';
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
          e.currentTarget.style.transform = 'translateY(0)';
        }}
        >
          {/* Date */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            marginBottom: '8px',
            justifyContent: isLeft ? 'flex-end' : 'flex-start',
          }}>
            <Calendar size={14} color={BRAND.primaryHover} />
            <span style={{
              fontSize: '13px',
              color: '#a78bfa',
              fontWeight: '600',
            }}>
              {date}
            </span>
          </div>

          {/* Title */}
          <h4 style={{
            margin: '0 0 8px 0',
            fontSize: '18px',
            fontWeight: '700',
            color: '#f9fafb',
          }}>
            {title}
          </h4>

          {/* Description */}
          <p style={{
            margin: '0 0 8px 0',
            fontSize: '14px',
            lineHeight: '1.6',
            color: '#cbd5e1',
          }}>
            {description}
          </p>

          {/* Location */}
          {location && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              justifyContent: isLeft ? 'flex-end' : 'flex-start',
            }}>
              <MapPin size={14} color="#9ca3af" />
              <span style={{
                fontSize: '12px',
                color: '#9ca3af',
                fontStyle: 'italic',
              }}>
                {location}
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Center Line & Node */}
      <div style={{
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}>
        {/* Node */}
        <div style={{
          width: '16px',
          height: '16px',
          borderRadius: '50%',
          background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryHover})`,
          border: '3px solid #060010',
          boxShadow: `0 0 0 4px rgba(147, 51, 234, 0.2), 0 0 20px ${BRAND.primary}60`,
          zIndex: 2,
          flexShrink: 0,
        }} />

        {/* Vertical Line */}
        <div style={{
          width: '2px',
          flex: 1,
          background: 'linear-gradient(180deg, rgba(147, 51, 234, 0.5), rgba(147, 51, 234, 0.1))',
          marginTop: '8px',
        }} />
      </div>

      {/* Empty space for alignment */}
      <div style={{ flex: 1 }} />
    </div>
  );
};

const Timeline = ({ events = [] }) => {
  return (
    <div style={{
      margin: '40px auto',
      maxWidth: '900px',
      padding: '0 20px',
    }}>
      {/* Header */}
      <div style={{
        textAlign: 'center',
        marginBottom: '48px',
      }}>
        <h2 style={{
          fontSize: '32px',
          fontWeight: '700',
          background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryHover})`,
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: '8px',
        }}>
          Dòng thời gian
        </h2>
        <p style={{
          fontSize: '16px',
          color: '#cbd5e1',
        }}>
          Hành trình của chúng tôi
        </p>
      </div>

      {/* Timeline Items */}
      <div style={{ position: 'relative' }}>
        {events.map((event, index) => (
          <TimelineItem
            key={index}
            date={event.date}
            title={event.title}
            description={event.description}
            location={event.location}
            side={index % 2 === 0 ? 'left' : 'right'}
          />
        ))}

        {/* End Node */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          marginTop: '-20px',
        }}>
          <div style={{
            width: '24px',
            height: '24px',
            borderRadius: '50%',
            background: `linear-gradient(135deg, ${BRAND.primary}, ${BRAND.primaryHover})`,
            border: '4px solid #060010',
            boxShadow: `0 0 0 6px rgba(147, 51, 234, 0.2), 0 0 30px ${BRAND.primary}80`,
          }} />
        </div>
      </div>
    </div>
  );
};

export default Timeline;
