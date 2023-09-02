function Radio({ children, value, name, defaultChecked, disable, onChange, checked }) {
    return (
      <label>
        <input
          type="radio"
          value={value}
          name={name}
          defaultChecked={defaultChecked}
          disabled={disable}
          onChange={onChange}
          checked={checked}
        />
        {children}
      </label>
    );
}

function RadioGroup({ children }) {
    return (
      <fieldset>
        {children}
      </fieldset>
    );
}

export {Radio, RadioGroup}