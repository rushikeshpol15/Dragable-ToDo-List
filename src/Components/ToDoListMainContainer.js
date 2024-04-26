import { useEffect, useState } from 'react';
import '../Styles/ToDoListContainer.css';
import { wait } from '@testing-library/user-event/dist/utils';
import axios from 'axios';
import ListComponent from './ListComponent';
import Swal from 'sweetalert2';
function ToDoListContainer()
{
    let[boardName,setBoardName]=useState('');
    let[invalidBoardInput,setInvalidBoardInput]=useState(false);
    let[allDropVisibility,setAllDropVisibility]=useState(false);
    let[data,setData]=useState([]);

    //for tracking which element is dragged
    let[dropingIndex,setDropingIndex]=useState(-1);
    let[localStorageNameToRemove,setLocalStorageNameToRemove]=useState('');
    let[elementRef,setElementRef]=useState('');

    //for tracking which where is dropped
    let[droppedIndex,setDroppedIndex]=useState(-1);
    let[localStorageNameToAdd,setLocalStorageNameToAdd]=useState('');

  
    let [isExtraListAdded,setIsExtraListAdded]=useState(false);

   async function handleAddBoard()
    {
        try {
            if(boardName=='')
            {
                setInvalidBoardInput(true);
                return;
            }
            if(localStorage.getItem('board')!=null)
            {
                Swal.fire("you have already created customizable 4th task");
                document.getElementById('modal-closebtn').click();
                return;
            }

            localStorage.setItem('board',boardName);
            setIsExtraListAdded(true);
          
            setBoardName('');
            document.getElementById('modal-closebtn').click();
        } catch (error) {
            console.log(error);
        }
    }

    //if element is dragged or leaved then below function will be called
    function handlesetAllDropVisibilityOnOnClickActive(element,index,localStorageNameRef)
    {
        setElementRef(element);
        setDropingIndex(index);
        setLocalStorageNameToRemove(localStorageNameRef);
        setAllDropVisibility(true);
    }
    function handlesetAllDropVisibilityOnOnLeave()
    {
        setAllDropVisibility(false);
    }

    //when droped on drag box
    function whenOnDropEventOccurs(localStorageName,index)
    {
        if(allDropVisibility==false)
        {
            return;
        }
        setLocalStorageNameToAdd(localStorageName);
        setDroppedIndex(index)

        //removing the dragged element from to do list first
        let getLocalStorageDataForRemoving=JSON.parse(localStorage.getItem(localStorageNameToRemove));
        let filteredData=getLocalStorageDataForRemoving.filter((element,index)=>{
            return index!=dropingIndex
        })
        let payloadData=JSON.stringify(filteredData);
        localStorage.setItem(localStorageNameToRemove,payloadData);


        //add the dragged element in droping position
        if(localStorage.getItem(localStorageName)==null)
        {
            let demo=JSON.stringify([]);
            localStorage.setItem(localStorageName,demo);
        }
        let temp=JSON.parse(localStorage.getItem(localStorageName));
        temp.splice(index,0,elementRef);
        let payloadData2=JSON.stringify(temp);
        localStorage.setItem(localStorageName,payloadData2);


        setAllDropVisibility(false);

        // console.log('localStorageName to be in added :',localStorageName);
    }

    useEffect(()=>{
        if(localStorage.getItem('board')!=null)
        {
            setIsExtraListAdded(true);
        }
    },[])
    return(
        <>
        <div className='todo-list-main-container' >
            <nav className="todo-list-create-board-container">
                <button className="create-board-btn" data-bs-toggle="modal" data-bs-target="#staticBackdrop">Create New Board</button>
            </nav>
                {/* TO add board  */}
                <div className="modal fade" id="staticBackdrop" data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Add Board</h1>
                                <button type="button" className="btn-close" onClick={()=>{setBoardName('');}} data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <label htmlFor='boardName'>Enter Board Name :</label>
                                <input type='text' value={boardName} id='boardName' className='ms-md-2 rounded-1 p-1 px-2' onChange={(e) => { setBoardName(e.target.value) }} />
                                {invalidBoardInput ? <div className='text-danger mt-2'>Plaese Enter Valid Board Name</div> : null}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={()=>{setBoardName('');}} data-bs-dismiss="modal" id='modal-closebtn'>Close</button>
                                <button type="button" className="create-board-btn rounded-2 p-1 px-2" onClick={handleAddBoard}>Add Board</button>
                            </div>
                        </div>
                    </div>
                </div>

            <div className={isExtraListAdded?'list-box-grid-container four-grid':'list-box-grid-container'}>
                <div>
                    <ListComponent title='Things To Do' forStorageName='todo' modalId='one' closeModalId='closeOne' allDropVisibility={allDropVisibility} handlesetAllDropVisibilityOnOnClickActive={handlesetAllDropVisibilityOnOnClickActive} handlesetAllDropVisibilityOnOnLeave={handlesetAllDropVisibilityOnOnLeave} whenOnDropEventOccurs={whenOnDropEventOccurs}/>
                </div>
                <div>
                    <ListComponent title='Doing' forStorageName='doing' modalId='two' closeModalId='closeTwo' allDropVisibility={allDropVisibility} handlesetAllDropVisibilityOnOnClickActive={handlesetAllDropVisibilityOnOnClickActive} handlesetAllDropVisibilityOnOnLeave={handlesetAllDropVisibilityOnOnLeave} whenOnDropEventOccurs={whenOnDropEventOccurs}/>
                </div>
                <div>
                    <ListComponent title='Done' forStorageName='done' modalId='three' closeModalId='closeThree' allDropVisibility={allDropVisibility} handlesetAllDropVisibilityOnOnClickActive={handlesetAllDropVisibilityOnOnClickActive} handlesetAllDropVisibilityOnOnLeave={handlesetAllDropVisibilityOnOnLeave} whenOnDropEventOccurs={whenOnDropEventOccurs}/>
                </div>
               { localStorage.getItem('board')?<div>
                    <ListComponent title={localStorage.getItem('board')} forStorageName={localStorage.getItem('board')} modalId='four' closeModalId='closeFour' allDropVisibility={allDropVisibility} handlesetAllDropVisibilityOnOnClickActive={handlesetAllDropVisibilityOnOnClickActive} handlesetAllDropVisibilityOnOnLeave={handlesetAllDropVisibilityOnOnLeave} whenOnDropEventOccurs={whenOnDropEventOccurs}/>
                </div>:null}
               
            </div>
        </div>




        </>
    )
}
export default ToDoListContainer;