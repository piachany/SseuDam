import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { APITestPage } from './APITestPage'
import Calendar from "react-calendar"
import "react-calendar/dist/Calendar.css"

interface Note {
  [key: string]: string;
}

export const Administrator: React.FC = () => {
  // 상태 관리
  const [apartmentName, setApartmentName] = useState('')
  const [buildings, setBuildings] = useState<string[]>([])
  const [collectionPoints, setCollectionPoints] = useState<string[]>([])
  const [assignments, setAssignments] = useState<{ [key: string]: string[] }>({})

  // 달력 관련 상태 추가
  const [date, setDate] = useState<Date | null>(new Date())
  const [notes, setNotes] = useState<Note>({})
  const [inputValue, setInputValue] = useState("")

  const navigate = useNavigate()

  // 컴포넌트 마운트 시 저장된 메모 불러오기
  useEffect(() => {
    const savedNotes = localStorage.getItem("adminNotes")
    if (savedNotes) {
      setNotes(JSON.parse(savedNotes))
    }
  }, [])

  // 메모 저장 함수
  const handleSaveNote = () => {
    if (!date || !inputValue.trim()) return

    const updatedNotes = {
      ...notes,
      [date.toDateString()]: inputValue
    }

    setNotes(updatedNotes)
    localStorage.setItem("adminNotes", JSON.stringify(updatedNotes))
    setInputValue("")
  }

  // 메모 삭제 함수
  const handleDeleteNote = (dateKey: string) => {
    const updatedNotes = { ...notes }
    delete updatedNotes[dateKey]
    
    setNotes(updatedNotes)
    localStorage.setItem("adminNotes", JSON.stringify(updatedNotes))
  }

  // 날짜 변경 핸들러
  const handleDateChange = (value: Date | Date[] | null) => {
    if (value instanceof Date) {
      setDate(value)
      setInputValue(notes[value.toDateString()] || "")
    }
  }

  // 데이터 저장 및 현황 페이지로 이동
  const handleFinish = () => {
    if (!apartmentName || buildings.length === 0 || collectionPoints.length === 0 || Object.keys(assignments).length === 0) {
      alert('모든 필드를 채워주세요.')
      return
    }

    const data = {
      apartmentName,
      buildings,
      collectionPoints,
      assignments
    }

    localStorage.setItem('apartmentData', JSON.stringify(data))
    navigate('/admin/status', { state: data })
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold text-center text-green-600 mb-8">아파트 분리수거 관리자 페이지</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* 아파트 이름 입력 */}
        <ApartmentForm apartmentName={apartmentName} setApartmentName={setApartmentName} />

        {/* 아파트 동 입력 */}
        <BuildingForm buildings={buildings} setBuildings={setBuildings} />

        {/* 수거장 구역 입력 */}
        <CollectionPointForm collectionPoints={collectionPoints} setCollectionPoints={setCollectionPoints} />

        {/* 동별 수거장 할당 */}
        <AssignmentForm 
          apartmentName={apartmentName}
          buildings={buildings} 
          collectionPoints={collectionPoints} 
          assignments={assignments} 
          setAssignments={setAssignments} 
        />

        {/* 달력 섹션 추가 */}
        <div className="md:col-span-2 bg-white shadow-md p-6 rounded-lg">
          <h2 className="text-2xl font-bold mb-4 text-gray-700">일정 관리</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <Calendar 
                onChange={handleDateChange} 
                value={date} 
                className="w-full rounded-lg shadow-md"
              />
            </div>

            <div>
              <div className="mb-4">
                <input 
                  type="text" 
                  placeholder="메모를 입력하세요..." 
                  value={inputValue} 
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSaveNote()}
                  className="w-full p-2 border rounded-lg"
                />
                <button
                  onClick={handleSaveNote}
                  className="w-full mt-2 bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
                  disabled={!inputValue.trim()}
                >
                  메모 저장
                </button>
              </div>

              {Object.keys(notes).length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-semibold mb-2">📌 저장된 메모</h3>
                  <div className="max-h-60 overflow-y-auto">
                    {Object.entries(notes)
                      .sort((a, b) => new Date(b[0]).getTime() - new Date(a[0]).getTime())
                      .map(([dateKey, note]) => (
                        <div key={dateKey} className="p-2 border-b flex justify-between items-center">
                          <div>
                            <strong>{dateKey}:</strong> {note}
                          </div>
                          <button
                            onClick={() => handleDeleteNote(dateKey)}
                            className="text-red-500 hover:text-red-700 ml-2"
                          >
                            ❌
                          </button>
                        </div>
                      ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* API 테스트 섹션 */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-4">API 테스트</h2>
        <APITestPage />
      </div>

      {/* 저장 및 현황 보기 버튼 */}
      <button
        onClick={handleFinish}
        className="w-full mt-8 bg-green-500 text-white py-3 rounded-lg hover:bg-green-600"
      >
        저장 및 현황 보기
      </button>
    </div>
  )
}

// 1. 아파트 이름 입력 폼
const ApartmentForm: React.FC<{ 
  apartmentName: string; 
  setApartmentName: (name: string) => void 
}> = ({ apartmentName, setApartmentName }) => {
  const [inputValue, setInputValue] = useState('')

  const handleAddApartment = () => {
    if (inputValue.trim() === '') {
      alert('아파트 이름을 입력하세요.')
      return
    }
    setApartmentName(inputValue)
    setInputValue('')
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">1. 아파트 이름 입력</h2>
      
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        placeholder="아파트 이름을 입력하세요"
        className="border p-2 w-full rounded-lg mb-4"
      />

      <button
        onClick={handleAddApartment}
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        아파트 추가
      </button>

      {apartmentName && (
        <div className="mt-4 p-2 bg-green-100 text-green-700 rounded-lg">
          추가된 아파트: <strong>{apartmentName}</strong>
        </div>
      )}
    </div>
  )
}

// 2. 아파트 동 입력 폼
const BuildingForm: React.FC<{ 
  buildings: string[]; 
  setBuildings: (buildings: string[]) => void 
}> = ({ buildings, setBuildings }) => {
  const [newBuilding, setNewBuilding] = useState('')

  const addBuilding = () => {
    if (newBuilding && !buildings.includes(newBuilding)) {
      setBuildings([...buildings, newBuilding])
      setNewBuilding('')
    }
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">2. 아파트 동 입력</h2>
      <input
        type="text"
        value={newBuilding}
        onChange={(e) => setNewBuilding(e.target.value)}
        placeholder="동 번호 입력 (예: 101동)"
        className="border p-2 w-full rounded-lg mb-4"
      />
      <button 
        onClick={addBuilding} 
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        동 추가
      </button>

      <div className="mt-4">
        {buildings.map((building, index) => (
          <div key={index} className="p-2 bg-gray-200 rounded-lg mb-2">{building}</div>
        ))}
      </div>
    </div>
  )
}

// 3. 수거장 구역 입력 폼
const CollectionPointForm: React.FC<{ 
  collectionPoints: string[]; 
  setCollectionPoints: (points: string[]) => void 
}> = ({ collectionPoints, setCollectionPoints }) => {
  const [newPoint, setNewPoint] = useState('')

  const addCollectionPoint = () => {
    if (newPoint && !collectionPoints.includes(newPoint)) {
      setCollectionPoints([...collectionPoints, newPoint])
      setNewPoint('')
    }
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">3. 수거장 구역 입력</h2>
      <input
        type="text"
        value={newPoint}
        onChange={(e) => setNewPoint(e.target.value)}
        placeholder="수거장 이름 입력 (예: A구역)"
        className="border p-2 w-full rounded-lg mb-4"
      />
      <button 
        onClick={addCollectionPoint} 
        className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600"
      >
        수거장 추가
      </button>

      <div className="mt-4">
        {collectionPoints.map((point, index) => (
          <div key={index} className="p-2 bg-gray-200 rounded-lg mb-2">{point}</div>
        ))}
      </div>
    </div>
  )
}

// 4. 동별 수거장 할당 폼
const AssignmentForm: React.FC<{ 
  apartmentName: string
  buildings: string[]
  collectionPoints: string[]
  assignments: { [key: string]: string[] }
  setAssignments: (assignments: { [key: string]: string[] }) => void 
}> = ({ apartmentName, buildings, collectionPoints, assignments, setAssignments }) => {
  
  const toggleAssignment = (building: string, point: string) => {
    const updatedAssignments = { ...assignments }
    if (updatedAssignments[point]?.includes(building)) {
      updatedAssignments[point] = updatedAssignments[point].filter(b => b !== building)
    } else {
      updatedAssignments[point] = [...(updatedAssignments[point] || []), building]
    }
    setAssignments(updatedAssignments)
  }

  return (
    <div className="bg-white shadow-md p-6 rounded-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-700">4. 동별 수거장 연결</h2>
      {collectionPoints.length === 0 && <p className="text-red-500">먼저 수거장을 추가하세요.</p>}

      {collectionPoints.map((point, idx) => (
        <div key={idx} className="mb-4">
          <h3 className="font-semibold text-lg text-green-600">
            {apartmentName} - {point}
          </h3>

          {buildings.map((building, bIdx) => (
            <label key={bIdx} className="block mt-2">
              <input
                type="checkbox"
                checked={assignments[point]?.includes(building) || false}
                onChange={() => toggleAssignment(building, point)}
                className="mr-2"
              />
              {apartmentName} - {building}
            </label>
          ))}
        </div>
      ))}
    </div>
  )
}