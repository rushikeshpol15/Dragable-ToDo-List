import { useEffect, useState } from "react";
import "../Styles/ListComponent.css";
import { faClock } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsisVertical, faTrash } from "@fortawesome/free-solid-svg-icons";
function ListComponent(props)
{
    let[data,setData]=useState([]);
    let[task,setTask]=useState('');
    let[InvalidTask,setInvalidTask]=useState(false);
    let[showDropVisibility,setShowDropVisibility]=useState(false);

    useEffect(()=>{
        if(localStorage.getItem(props.forStorageName)!=null)
        {
            let responseData=JSON.parse(localStorage.getItem(props.forStorageName));
            setData(responseData);
        }
    },[localStorage.getItem(props.forStorageName)])

    function handleAddTask()
    {
        if(task=='')
        {
            setInvalidTask(true);
            return;
        }

        let date=new Date();

        const monthNames = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
          ];

        let temp=[...data];
        let currentDate=date.getDate();
        let currentMonth=monthNames[date.getMonth()+1];
        
        let obj={
            'item': task,
            'date' : currentDate +' '+currentMonth
        }
        temp.unshift(obj);
        setData([...temp]);
        let payloadData=JSON.stringify(temp);
        localStorage.setItem(props.forStorageName,payloadData);
        document.getElementById(props.closeModalId).click();


    }

    function handleDeletecard(Givenindex)
    {
        let filterData=data.filter((element,index)=>{
            return Givenindex!=index
        })
        let payloadData=JSON.stringify(filterData);
        localStorage.setItem(props.forStorageName,payloadData);
        setData(filterData);
    }

    function handleDragStart(element)
    {
        props.handlesetAllDropVisibilityOnOnClickActive(true)
    }
    function handleDragEnd()
    {
        props.handlesetAllDropVisibilityOnOnLeave()
    }

    function handleDragEnter()
    {
        setShowDropVisibility(true)
    }
    function handleDropLeave()
    {
        setShowDropVisibility(false)

    }
    return(
        <>
        <div className='list-box'>
                    <div className='list-title'>
                        <div>{props.title}</div>
                        <FontAwesomeIcon icon={faEllipsisVertical} style={{color:'#B3C1D7'}}/>
                    </div>
                    <button className='add-new-card w-100 mb-2' data-bs-toggle="modal" data-bs-target={`#${props.modalId}`}><span style={{fontSize:'1.1em'}}>+</span> Add New Card</button>
                    <div className={props.allDropVisibility?"emptydiv":'hideEmptyDiv'}  onDragEnter={handleDragEnter} onDrop={(e)=>{props.whenOnDropEventOccurs(props.forStorageName,0)}} onDragLeaveCapture={handleDropLeave} onDragOver={(e)=>{e.preventDefault();}}>Drop Here...</div>
                    
                    {data.length>0&&data.map((element,index)=>{
                         
                         return <>
                        <div className='card-outer-div' draggable onDragStart={()=>{props.handlesetAllDropVisibilityOnOnClickActive(element,index,props.forStorageName)}} onDragEnd={()=>{props.handlesetAllDropVisibilityOnOnLeave()}}>
                            <div className='card-inner-div'>
                                <div>{element.item}</div>
                                <div style={{fontSize:'0.8em'}} className="mt-1">
                                    <FontAwesomeIcon icon={faClock} style={{color:'white',marginRight:'0.5em'}}/>
                                    {element.date}
                                </div>                                
                            </div>
                            <FontAwesomeIcon icon={faTrash} style={{color:'white',cursor:'pointer'}} onClick={()=>{handleDeletecard(index)}}/>
                        </div>
                        {/* empty div  */}
                        <div className={props.allDropVisibility?"emptydiv":'hideEmptyDiv'} onDragEnter={handleDragEnter} onDragLeaveCapture={handleDropLeave} onDrop={(e)=>{props.whenOnDropEventOccurs(props.forStorageName,index+1)}} onDragOver={(e)=>{e.preventDefault();}}>Drop Here...</div>
                        </>
                    })}

        </div>

        <div className="modal fade" id={props.modalId} data-bs-backdrop="static" data-bs-keyboard="false" tabIndex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                    <div className="modal-dialog">
                        <div className="modal-content">
                            <div className="modal-header">
                                <h1 className="modal-title fs-5" id="staticBackdropLabel">Add Task</h1>
                                <button type="button" className="btn-close" onClick={()=>{setTask('');}} data-bs-dismiss="modal" aria-label="Close"></button>
                            </div>
                            <div className="modal-body">
                                <label htmlFor='boardName'>Enter Task Name :</label>
                                <input type='text' value={task} id='boardName' className='ms-sm-2 rounded-1 p-1 px-2' onChange={(e) => { setTask(e.target.value);setInvalidTask(false); }} />
                                {InvalidTask ? <div className='text-danger mt-2'>Plaese Enter Valid Task</div> : null}
                            </div>
                            <div className="modal-footer">
                                <button type="button" className="btn btn-secondary" onClick={()=>{setTask('');}} data-bs-dismiss="modal" id={props.closeModalId}>Close</button>
                                <button type="button" className="create-board-btn rounded-2 p-1 px-2" onClick={handleAddTask}>Add Task</button>
                            </div>
                        </div>
                    </div>
                </div>

        </>
    )
}
export default ListComponent;