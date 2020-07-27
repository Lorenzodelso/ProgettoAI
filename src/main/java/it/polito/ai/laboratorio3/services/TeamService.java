package it.polito.ai.laboratorio3.services;

import it.polito.ai.laboratorio3.dtos.*;
import it.polito.ai.laboratorio3.entities.Docente;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.userdetails.UserDetails;

import java.io.Reader;
import java.util.List;
import java.util.Optional;

public interface TeamService {
    static final int ATTIVO=1;
    static final int NON_ATTIVO=0;

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    boolean addCourse(CourseDTO course, List<String> ids);

    Optional<CourseDTO> getCourse(String name);
    List<CourseDTO> getAllCourses();
    boolean addStudent(StudentDTO student, byte[] studentImg);
    boolean addProfessor(ProfessorDTO professor);
    Optional<StudentDTO> getStudent(String studentId);
    List<StudentDTO> getAllStudents();
    List<StudentDTO> getEnrolledStudents(String courseName);

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    boolean addStudentToCourse(String studentId, String courseName);

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    void enableCourse(String courseName);

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    void disableCourse(String courseName);

    List<Boolean> addAll(List<StudentDTO> students);
    List<Boolean> enrollAll(List<String> studentIds, String courseName);

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    List<Boolean> addAndEroll(Reader r, String courseName);

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    List<CourseDTO> getCourses(String studentId);

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    List<TeamDTO> getTeamsForStudent(String studentId);
    List<StudentDTO>getMembers(Long TeamId);

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    TeamDTO proposeTeam(String courseId, String name, List<String> memberIds);

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    List<TeamDTO> getTeamForCourse(String courseName);

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    List<StudentDTO> getStudentsInTeams(String courseName);

    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    List<StudentDTO> getAvailableStudents(String courseName);

    void activeTeam(Long teamId);
    void evictTeam(Long teamId);


    List<TokenDTO> getRequestsForStudent(String id, String name);

    String getCourseNameByTeamId(Long id);

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    void deleteCourse(String name, String username);

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    CourseDTO updateCourse(String name,CourseDTO dto, List<String> ids);
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    void unsubscribeOne(String name, String studentId, String username);
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    void unsubscribeMany(String name, List<String> ids, String username);

    List<VmDTO> getVmsByTeam(String name, Long teamId, String username);
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    void changeVmsLimit(String name, Long teamId, String username, int vcpus, int GBram, int GBdisk);

    List<TaskDTO> getTasks(String name);
    TaskDTO getTask(String name, Long taskId,UserDetails userDetails);
    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    TaskDTO createTask(String name, String username, int days);

    @PreAuthorize("hasAuthority('ROLE_PROFESSOR')")
    List<EssayDTO> getEssays(Long taskId);

    EssayDTO getEssay(Long taskId, Long essayId, UserDetails userDetails);
    EssayDTO loadEssay(Long taskId, Long essayId, byte[] data, UserDetails userDetails, Long voto);
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    List<VmDTO> getVmsByStudent(String studentId, Long teamId);
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    VmDTO createVm(String id, Long teamId, VmDTO dto, byte[] bytes);
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    void switchVm(String id, Long teamId, Long vmId);
    @PreAuthorize("hasAuthority('ROLE_STUDENT')")
    void deleteVm(String id, Long teamId, Long vmId);

    byte[] getImage(String id);

    List<ImageDTO> getStorical(String name, Long taskId, Long essayId);
}
