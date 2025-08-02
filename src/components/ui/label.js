import React from 'react';
import PropTypes from 'prop-types';
import clsx from 'clsx';

/**
 * A simple reusable Label component
 * @param {Object} props
 * @param {string} props.htmlFor - The id of the input element this label is associated with
 * @param {string} props.className - Additional Tailwind CSS classes
 * @param {React.ReactNode} props.children - Label content
 */
export const Label = ({ htmlFor, className, children }) => {
  return (
    <label
      htmlFor={htmlFor}
      className={clsx('block text-sm font-medium text-gray-700', className)}
    >
      {children}
    </label>
  );
};

Label.propTypes = {
  htmlFor: PropTypes.string,
  className: PropTypes.string,
  children: PropTypes.node.isRequired,
};
