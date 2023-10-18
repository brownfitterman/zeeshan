import React from 'react';
import './text.css';
// import TextField from '@material-ui/core/TextField';

const ReduxInput = ({
  input,
  type,
  name,
  id,
  value,
  label,
  onChange,
  onBlur,
  placeholder,
  defaultValue,
  meta,
  className,
  disabled,
  maxLength,
  mobileFormat,
  tabIndex,
  style,
  fieldName,
  min,
  max,
  controlledMaxAge,
  negativeNumberBlocked
}) => {
  return (
    <>
      <div class="group">
        <input
          {...input}
          type={type}
          name={name}
          id={id}
          className={`${className} ${'MuiInputBase-input MuiInput-input'}`}
          value={value}
        />
        <span class="highlight"></span>
        <span class="bar"></span>
        <label>{label}</label>
      </div>
      {/* <TextField
                style={style}
                tabIndex={tabIndex}
                
                label={label}
                defaultValue={defaultValue}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
                placeholder={placeholder}
                className={`${className} `}
            // disabled={!!disabled}
            // maxLength={maxLength}
            // autocomplete="off"
            /> */}
    </>
  );
};

export { ReduxInput };
