import React, {useState, useEffect} from 'react';
import SingleInput from './singleInput';
import Checkbox from './checkbox';
import Select from './select';
import Modal from './modal';

// export default class ItemEditor extends Component {

export const ItemEditor = () => {
  
  const [fieldValue, setFieldValue] = useState ('');

  const [fieldType, setFieldType] = useState ([]);
  const [fieldOptions, setFieldOptions] = useState ([]);

  const [Field1, setField1] = useState ('');

  const [selectedCheckBox, setSelectedCheckBox] = useState (false);

  const [selectedOption, setSelectedOption] = useState ('');

  const [data, setData] = useState ([]);

  const [undoStack, setUndo] = useState ([]);
  const [redoStack, setRedo] = useState ([]);

  const [fieldId, setFieldId] = useState ('');

  const [previousState, setPreviousState] = useState ([]);

  const [modal, setModal] = useState(false)
  const [isShowing, setIsShowing] = useState (true);


  let prev = [];

  const getData = () => {
    fetch ('./data.json', {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })
      .then (function (response) {
        return response.json ();
      })
      .then (function (myJson) {
        
        setData (myJson);
        let data = myJson.items
        let firstItem = []

        data.map(item => {
          if(item.id == 1) {
            firstItem = {
              id: item.id,
                fields: {
                fieldOptions: item.fields.fieldOptions,
                fieldValue: item.fields.fieldValue,
                fieldType: item.fields.fieldType,
              },
            }
          }
        });

        display(false, firstItem)
      });
  };

  useEffect (() => {
    getData ();
  },[]);

  const modalHide = () => {
    setIsShowing(!isShowing);
    setModal(!modal);
  }


  const handleUndo = () => {

    let pop = undoStack.pop ();
    if (pop) redoStack.push (pop);
    if (undoStack.length > 0) {
      display (true, undoStack[undoStack.length - 1]);
    } else {
      let currentState = [];
      data.items.map (item => {
        if (item.id == fieldId) {
          currentState = {
            id: item.id,
            fields: {
              fieldOptions: item.fields.fieldOptions,
              fieldValue: item.fields.fieldValue,
              fieldType: item.fields.fieldType,
            },
          };
        }
      });
      display (true, currentState);
    }
  };

  const handleRedo = () => {
    let pop = redoStack.pop ();
    if (pop) {
      undoStack.push (pop);
      display (true, pop);
    }
  };

  const display = (raw, item) => {
    if (!raw) {
      if (!previousState[item.id]) {
        previousState[item.id] = item;
      }
      item = previousState[item.id];
    }

    setFieldId (item.id);
    item.fields.fieldType != undefined && setFieldType (item.fields.fieldType);
    setFieldOptions (item.fields.fieldOptions);
    setFieldValue (item.fields.fieldValue);

    let fieldOptions = item.fields.fieldOptions;

    fieldOptions.map (option => {
      item.fields.fieldValue.map (value => {
        if (option.optionValue == value) {
          setSelectedOption (option.optionName);
        }
      });
    });

    item.fields.fieldValue.map (value => {
      if (typeof value == 'boolean') {
        setSelectedCheckBox (value);
      }
    });
  };

  const handleCancel = () => {
    let currentState = [];
    setPreviousState ([]);
    setUndo ([]);
    setRedo ([]);

    data.items.map (item => {
      if (item.id == fieldId) {
        currentState = {
          id: item.id,
          fields: {
            fieldOptions: item.fields.fieldOptions,
            fieldValue: item.fields.fieldValue,
            fieldType: item.fields.fieldType,
          },
        };
      }
    });
    display (true, currentState);
  };

  const handleSave = () => {

    console.log("save callBack")
    console.log(previousState);

    setModal(true);

  }

  const handleItemClick = item => {
    display (false, item);
  };

  const handleOnChange = (e, i, inputType) => {
    const items = [...fieldValue];

    if (inputType == 'singleInput') {
      items[i] = e.target.value;
    }

    if (inputType == 'selectOption') {
      fieldOptions.map (option => {
        if (e.target.value == option.optionName) {
          items[i] = option.optionValue;
          setSelectedOption (option.optionName);
        }
      });
    }

    if (inputType == 'selectCheckBox') {
      let toBool = !!JSON.parse (String (e.target.value).toLowerCase ());
      items[i] = !toBool;
      setSelectedCheckBox (toBool);
    }

    setFieldValue (items);

    let currentState = {
      id: fieldId,
      fields: {
        fieldValue: items,
        fieldOptions: fieldOptions,
      },
    };

    let test = previousState;
    test[fieldId] = currentState;
    setPreviousState (test);
    undoStack.push (currentState);
  };

  return (
    <div className="item-editor">
      <div className="header">
        <span> Item Editor </span>

        <div className="header-buttons">
          <button onClick={handleUndo}> Undo </button> &nbsp;
          <button onClick={handleRedo}> Redo </button> &nbsp;&nbsp;&nbsp;

          <button onClick={handleSave}> Save </button> &nbsp;
          <button onClick={handleCancel}> Cancel </button>
        </div>

      </div>

      <div className="body">

        <div className="items">
          {data.items &&
            data.items.length > 0 &&
            data.items.map (item => (
              <table className="" key={item.id}>
                <colgroup>
                  <col />
                  <col />
                </colgroup>
                <tbody className="ant-table-tbody">
                  <p onClick={() => handleItemClick (item)}> {item.name} </p>
                </tbody>
              </table>
            ))}
        </div>

        <div className="fields">

          {fieldValue.length > 0 &&
            fieldValue.map ((n, i) => (
              <div key={i}>
                {typeof n == 'string' &&
                  <SingleInput
                    name="text"
                    inputType="text"
                    title={'Field 1'}
                    content={Field1}
                    value={n}
                    onChange={e => handleOnChange (e, i, 'singleInput')}
                  />}
                {typeof n == 'number' &&
                  <Select
                    title={'Field 2'}
                    controlFunc={e => handleOnChange (e, i, 'selectOption')}
                    options={fieldOptions}
                    selectedOption={selectedOption}
                  />}
                {' '}
                <br />

                {typeof n == 'boolean' &&
                  <Checkbox
                    title={'Field 3'}
                    type={'checkbox'}
                    controlFunc={e => handleOnChange (e, i, 'selectCheckBox')}
                    selectedOption={n}
                  />}
              </div>
            ))}

        </div>

        {modal && 
          <Modal 
            isShowing={isShowing}
            hide={modalHide}
          />
        }

      </div>

    </div>
  );
};
