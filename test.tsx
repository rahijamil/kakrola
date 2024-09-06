<thead>
<tr className="border-y border-text-200 flex items-center divide-x divide-text-200 text-xs font-medium mx-8 min-w-max">
  <td className="w-full max-w-[632px] min-w-[632px] p-2">
    Task name
  </td>
  <td className="min-w-32 p-2">Assignee</td>
  <td className="min-w-32 p-2">Due date</td>
  <td className="min-w-32 p-2">Priority</td>
  <td className="min-w-32 p-2">Labels</td>
</tr>
</thead>

<tbody>
<div className="space-y-4">
  <UngroupedTasks
    tasks={unGroupedTasks}
    showUngroupedAddTask={showUngroupedAddTask}
    setShowUngroupedAddTask={setShowUngroupedAddTask}
    project={project}
    setTasks={setTasks}
    showTaskItemModal={showTaskItemModal}
    setShowTaskItemModal={setShowTaskItemModal}
  />

  <AddNewSectionListView
    section={{ id: "ungrouped", title: "Ungrouped", tasks: [] }}
    index={0}
    newSectionName={newSectionName}
    setNewSectionName={setNewSectionName}
    handleAddSection={handleAddSection}
    setShowAddSection={setShowAddSection}
    showAddSection={showAddSection}
    sectionAddLoading={sectionAddLoading}
  />
</div>

{columns
  .filter((c) => c.id !== "ungrouped")
  .map((column, columnIndex) => (
    <Draggable
      key={column.id}
      draggableId={column.id}
      index={columnIndex}
    >
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className="space-y-2"
        >
          <ListViewSection
            section={
              sections.find(
                (s) => s.id.toString() === column.id
              )!
            }
            sections={sections}
            setSections={setSections}
            toggleSection={toggleSection}
            groupedTasks={groupedTasks}
            showSectionMoreOptions={showSectionMoreOptions}
            setShowSectionMoreOptions={
              setShowSectionMoreOptions
            }
            setShowDeleteConfirm={setShowDeleteConfirm}
            setShowArchiveConfirm={setShowArchiveConfirm}
            setShowAddTask={setShowAddTask}
            setTasks={setTasks}
            showAddTask={showAddTask}
            tasks={tasks}
            project={project}
            showTaskItemModal={showTaskItemModal}
            setShowTaskItemModal={setShowTaskItemModal}
          />

          <AddNewSectionListView
            section={column}
            index={columnIndex}
            newSectionName={newSectionName}
            setNewSectionName={setNewSectionName}
            handleAddSection={handleAddSection}
            setShowAddSection={setShowAddSection}
            showAddSection={showAddSection}
            sectionAddLoading={sectionAddLoading}
          />
        </div>
      )}
    </Draggable>
  ))}

{listProvided.placeholder}
</tbody>